#!/usr/bin/env node

/* 
TODO: ADD INSTRUCTION ON HOW THIS WORKS
*/
import { ArgumentTypes } from "../../typescript/apps/web/utils/typescript";

import path from "path";
import glob from "glob";
import prompt from "prompt";
import sh from "shelljs";
import util from "util";
import yargs from "yargs/yargs";

import { Environment } from "../resources/shared/types/own-types";
import { getEnvironmentVariables } from "../resources/shared/validations";
import { setupUnsealedSecretFiles } from "../secretsManagement/setupSecrets";
import { generateManifests } from "./generateManifests";
import { getImageTagsFromDir } from "./getImageTagsFromDir";
import { promptKubernetesClusterSwitch } from "./promptKubernetesClusterSwitch";

// TODO: Use prompt to ask for which cluster this should be used with for the sealed secrets controller
// npm i inquirer
type EnvName = keyof ReturnType<typeof getEnvironmentVariables>;
export const globAsync = util.promisify(glob);
const promptGetAsync = util.promisify(prompt.get);
export const ENVIRONMENT: EnvName = "ENVIRONMENT";
// find ./kubernetes -name "secret*ml"
const yesOrNoOptions = ["y", "yes", "no", "n"] as const;
type YesOrNoOptions = typeof yesOrNoOptions[number];

export const ARGV = yargs(process.argv.slice(2))
  .options({
    e: {
      alias: "environment",
      choices: ["local", "development", "staging", "production"] as Environment[],
      describe: "The environment you're generating the manifests for.",
      demandOption: true,
    },
    gss: {
      alias: "generate-sealed-secrets",
      choices: yesOrNoOptions,
      // default: "no" as YesOrNoOptions,
      describe: "Generate sealed secrets manifests from generated plain secrets manifests",
      demandOption: true,
    },
    kuso: {
      alias: "keep-unsealed-secrets-output",
      choices: yesOrNoOptions,
      default: "no" as YesOrNoOptions,
      describe: "Keep unsealed secrets output generated plain kubernetes manifests",
      // demandOption: true,
    },
    kusi: {
      alias: "keep-unsealed-secrets-input",
      choices: yesOrNoOptions,
      // default: "no" as YesOrNoOptions,
      describe:
        "Keep unsealed secrets inputs plain configs used to generate kubernetes secrets manifests",
      demandOption: true,
    },
  } as const)
  .parseSync();

// const manifestsDirForEnv = getManifestsOutputDirectory(ARGV.e);
export const manifestsDirForEnv = path.join("manifests", "generated", ARGV.e);

prompt.override = ARGV;
prompt.start();

async function bootstrap() {
  const yes: YesOrNoOptions[] = ["yes", "y"];

  const generateSealedSecrets = yes.includes(ARGV.gss);
  const imageTags = await getImageTagsFromDir();

  if (!generateSealedSecrets) {
    await generateManifests({
      environment: ARGV.e,
      imageTags,
      keepSecretOutputs: yes.includes(ARGV.kuso),
      keepSecretInputs: yes.includes(ARGV.kusi),
      // When false, does not require cluster being live
      regenerateSealedSecrets: false,
    });

    return;
  }

  await promptKubernetesClusterSwitch();

  setupUnsealedSecretFiles();

  /*
       This requires the above step with initial cluster setup making sure that the sealed secret controller is
       running in the cluster */

  // # Apply namespace first
  // TODO: Use a function to get and share this with manifestDirectory.ts module
  sh.exec(`kubectl apply -R -f ${manifestsDirForEnv}/namespaces`);

  // # Apply setups with sealed secret controller
  sh.exec(`kubectl apply -R -f  ${manifestsDirForEnv}/sealed-secret-controller`);

  // # Wait for bitnami sealed secrets controller to be in running phase so that we can use it to encrypt secrets
  sh.exec(`kubectl rollout status deployment/sealed-secrets-controller -n=kube-system`);
  await generateManifests({
    environment: ARGV.e,
    imageTags,
    keepSecretOutputs: yes.includes(ARGV.kuso),
    keepSecretInputs: yes.includes(ARGV.kusi),
    regenerateSealedSecrets: true,
  });

  // TODO: could conditionally check the installation of argocd also cos it may not be necessary for local dev
  sh.exec(`kubectl apply -f ${manifestsDirForEnv}/argocd-controller/0-crd`);
  sh.exec(`kubectl apply -f ${manifestsDirForEnv}/argocd-controller/1-manifest`);
}

bootstrap();
