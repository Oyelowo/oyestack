import { SecretTemplate } from "./../resources/shared/types/SecretTemplate";
import { SealedSecretTemplate } from "./../resources/shared/types/sealedSecretTemplate";
import {
  getGeneratedEnvManifestsDir,
  ResourceName,
} from "./../resources/shared/manifestsDirectory";
import { ImageTags } from "./../resources/shared/validations";
import sh from "shelljs";
import { Environment } from "../resources/shared/types/own-types";
import { ENVIRONMENT } from "./bootstrap";
import p from "path";
import c from "chalk";
import { clearUnsealedInputTsSecretFilesContents } from "./secretsManagement/setupSecrets";
import yaml from "js-yaml";
import fs from "fs";
/*
GENERATE ALL KUBERNETES MANIFESTS USING PULUMI
*/
interface GenerateManifestsProps
  extends Pick<GenSealedSecretsProps, "environment"> {
  imageTags: ImageTags;
}

export async function generateManifests({
  environment,
  imageTags,
}: GenerateManifestsProps) {
  const manifestsDirForEnv = getGeneratedEnvManifestsDir(environment);
  sh.exec("npm i");
  sh.rm("-rf", "./login");
  sh.mkdir("./login");

  sh.exec("pulumi login file://login");

  sh.echo(
    c.blueBright(
      `First Delete old resources for" ${environment} at ${manifestsDirForEnv}`
    )
  );

  const getManifestsWithinDirName = (dirName: "1-manifest" | "0-crd") =>
    sh
      .exec(`find ${manifestsDirForEnv} -type d -name "${dirName}"`, {
        silent: true,
      })
      .stdout.split("\n");
  const manifestsNonCrds = getManifestsWithinDirName("1-manifest");
  const manifestsCrds = getManifestsWithinDirName("0-crd");
  manifestsNonCrds.concat(manifestsCrds).forEach((f) => sh.rm("-rf", f.trim()));

  sh.exec(
    "export PULUMI_CONFIG_PASSPHRASE='' && pulumi stack init --stack dev"
  );

  // Pulumi needs some environment variables set for generating deployments with image tag
  /* `export ${IMAGE_TAG_REACT_WEB}=tag-web export ${IMAGE_TAG_GRAPHQL_MONGO}=tag-mongo`
   */

  sh.exec(
    `
    ${getEnvVarsForScript(environment, imageTags)}
    export PULUMI_CONFIG_PASSPHRASE="" 
    pulumi up --yes --skip-preview --stack dev
   `
  );

  sh.rm("-rf", "./login");
}

/* 
GENERATE BITNAMI'S SEALED SECRET FROM PLAIN SECRETS MANIFESTS GENERATED USING PULUMI.
These secrets are encrypted using the bitnami sealed secret controller running in the cluster
you are at present context
*/
interface GenSealedSecretsProps {
  environment: Environment;
  keepSecretOutputs: boolean;
  keepSecretInputs: boolean;
  regenerateSealedSecrets: boolean;
}

export async function regenerateSealedSecretsManifests({
  environment,
  keepSecretInputs,
  keepSecretOutputs,
  regenerateSealedSecrets,
}: GenSealedSecretsProps) {
  // const contextDir = p.join(__dirname, "..", "manifests", "generated", environment);
  const contextDir = getGeneratedEnvManifestsDir(environment);
  const unsealedSecretsFilePathsForEnv = getFilePathsThatMatch({
    contextDir,
    pattern: "secret-*ml",
  });

  for (const unsealedSecretManifestPath of unsealedSecretsFilePathsForEnv) {
    const appManifestsDir = p.dirname(unsealedSecretManifestPath);

    if (regenerateSealedSecrets) {
      // The path format is: kubernetes/manifests/generated/production/applications/graphql-mongo/1-manifest
      // and we want as basedir: kubernetes/manifests/generated/production/applications/graphql-mongo
      const appBaseDir = p.join(appManifestsDir, "..");
      const unsealedSecretManifestFileName = p.basename(
        unsealedSecretManifestPath
      );
      const sealedSecretDir = p.join(appBaseDir, "sealed-secrets");
      const sealedSecretFilePath = p.join(
        sealedSecretDir,
        `sealed-${unsealedSecretManifestFileName}`
      );
      const sealedSecretsControllerName: ResourceName = "sealed-secrets";

      sh.mkdir(sealedSecretDir);

      // TODO: Check the content of the file to confirm if it is actually a secret object
      sh.echo(
        c.blueBright(
          `Generating sealed secret ${unsealedSecretManifestPath} \n to \n ${sealedSecretFilePath}`
        )
      );

      if (sealedSecretFilePath) {
        mergeSecretToSealedSecret({
          unsealedSecretManifestPath,
          sealedSecretsControllerName,
          sealedSecretFilePath,
        });

      } else {
        // TODO: Should I delete old sealed secrets before creating new ones?
        const kubeSeal = sh.exec(
          `kubeseal --controller-name ${sealedSecretsControllerName} < ${unsealedSecretManifestPath} -o yaml >${sealedSecretFilePath}`,
          {
            silent: true,
          }
        );

        sh.echo(c.greenBright(kubeSeal.stdout));
        if (kubeSeal.stderr) {
          sh.echo(`Error sealing secrets: ${c.redBright(kubeSeal.stderr)}`);
          sh.exit(1);
          return;
        }
      }

      sh.echo(
        c.greenBright(
          "Successfully generated sealed secret at",
          unsealedSecretManifestPath
        )
      );
    }

    sh.echo(
      c.blueBright(
        `Removing unsealed plain secret manifest ${unsealedSecretManifestPath}`
      )
    );

    // Delete unsealed plain secret if specified
    if (!keepSecretOutputs) {
      sh.rm("-rf", unsealedSecretManifestPath);
    }

    if (!keepSecretInputs) {
      clearUnsealedInputTsSecretFilesContents();
    }
  }
}

type MergeProps = {
  unsealedSecretManifestPath: string;
  sealedSecretsControllerName: string;
  sealedSecretFilePath: string;
}
function mergeSecretToSealedSecret({
  unsealedSecretManifestPath,
  sealedSecretsControllerName,
  sealedSecretFilePath,
}: MergeProps): void {
  const emptyStringInBase64 = "Cg==";
  const unsealedSecretJsonData: SecretTemplate = yaml.load(
    fs.readFileSync(unsealedSecretManifestPath, { encoding: "utf-8" })
  ) as SecretTemplate;

  const removeEmptyValue = ([_, value]: [string, string]) =>
    !(value === "" || value === null || value === emptyStringInBase64);
  const sealValue = ([key, value]: [string, string]) => [
    key,
    sh.exec(
      `echo -n ${value} | kubeseal --controller-name=${sealedSecretsControllerName} \
         --raw --from-file=/dev/stdin --namespace ${unsealedSecretJsonData.metadata.namespace} \
          --name ${unsealedSecretJsonData.metadata.name}`
    ),
  ];

  const { stringData, data } = unsealedSecretJsonData;
  const dataToSeal = stringData ?? data ?? {};
  const filteredSealedSecretsData = Object.fromEntries(
    Object.entries(dataToSeal).filter(removeEmptyValue).map(sealValue)
  );

  const existingSealedSecretJsonData: SealedSecretTemplate = yaml.load(
    fs.readFileSync(sealedSecretFilePath, { encoding: "utf-8" })
  ) as SealedSecretTemplate;

  const updatedSealedSecrets: SealedSecretTemplate = {
    ...existingSealedSecretJsonData,
    spec: {
      encryptedData: {
        ...existingSealedSecretJsonData?.spec?.encryptedData,
        ...filteredSealedSecretsData,
      },
      template: {
        ...existingSealedSecretJsonData?.spec?.template,
        data: null,
        metadata: unsealedSecretJsonData.metadata,
        type: unsealedSecretJsonData.type,
      },
    },
  };

  sh.exec(
    `echo '${yaml.dump(updatedSealedSecrets)}' > ${sealedSecretFilePath}`
  );

  // Something as simple as this would have worked but kubeseal doesnt handle merging properly
  // When there is a key in the new secret but not in the existing sealed secret, it throws an error
  // sh.exec(`echo '${JSON.stringify(Data)}' | kubeseal --controller-name ${sealedSecretsControllerName} -o yaml --merge-into  ${sealedSecretFilePath}`)
}

export function getEnvVarsForScript(
  environment: Environment,
  imageTags: ImageTags
) {
  const imageEnvVarSetterForPulumi = Object.entries(imageTags)
    .map(([k, v]) => `export ${k}=${v}`)
    .join(" ");
  return `
      ${imageEnvVarSetterForPulumi} 
      export ${ENVIRONMENT}=${environment}  
  `;
}

export function getFilePathsThatMatch({
  contextDir,
  pattern,
}: {
  contextDir: string;
  pattern: string;
}) {
  const UNSEALED_SECRETS_MANIFESTS_FOR_ENV = sh.exec(
    `find ${contextDir} -name "${pattern}"`,
    {
      silent: true,
    }
  );
  const unsealedSecretsFilePathsForEnv =
    UNSEALED_SECRETS_MANIFESTS_FOR_ENV.stdout
      .trim()
      .split("\n")
      .map((s) => s.trim());
  return unsealedSecretsFilePathsForEnv;
}
