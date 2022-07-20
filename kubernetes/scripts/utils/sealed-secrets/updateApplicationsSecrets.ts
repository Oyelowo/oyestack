import { SealedSecretTemplate } from './../../../resources/types/sealedSecretTemplate';
import { getSealedSecretResourceInfo, getSecretResourceInfo, KubeObjectInfo } from './../shared';
import c from 'chalk';
import p from 'path';
import yaml from 'js-yaml';
import sh from 'shelljs';
import { Environment, ResourceName } from '../../../resources/types/own-types';
import _ from 'lodash';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Namespace } from '../../../resources/infrastructure/namespaces/util';

const SEALED_SECRETS_CONTROLLER_NAME: ResourceName = 'sealed-secrets';

export async function updateAppSealedSecrets(environment: Environment) {

    const selectedUnsealedSecretsInfo = await getSelectedSecretKeysFromPrompt('local');

    for (let unsealedSecret of selectedUnsealedSecretsInfo) {
        const sealedSecretInfo = getSealedSecretResourceInfo('local');

        mergeUnsealedSecretToSealedSecret({
            unsealedSecretInfo: unsealedSecret,
            sealedSecretInfo: sealedSecretInfo,
        });
    }

}

type MergeProps = {
    unsealedSecretInfo: KubeObjectInfo;
    sealedSecretInfo: KubeObjectInfo[];
};
// getSelectedSecrets
export function mergeUnsealedSecretToSealedSecret({ sealedSecretInfo, unsealedSecretInfo }: MergeProps) {
    const {
        stringData,
        data,
        metadata: { name, namespace /* annotations */ },
    } = unsealedSecretInfo;

    if (!name && namespace) {
        throw new Error('Name or namespace not provided in the secret');
    }

    // Get corresponding previously(if it exists) generated sealed secrets info.
    const matchesUnsealedSecret = ({ metadata: m }: KubeObjectInfo) => m.name === name && m.namespace === namespace;
    const existingSealedSecretJsonData = sealedSecretInfo?.find(matchesUnsealedSecret);

    const sealSecretValue = (secretValue: string) => {
        return sh
            .exec(
                `echo -n ${secretValue} | kubeseal --controller-name=${SEALED_SECRETS_CONTROLLER_NAME} \
            --raw --from-file=/dev/stdin --namespace ${namespace} \
            --name ${name}`
            )
            .stdout.trim();
    };
    const secretRecord = stringData ?? data ?? {};
    const filteredSealedSecretsData = _.mapValues(secretRecord, sealSecretValue);

    // Update sealed secret object to be converted to yaml
    const updatedSealedSecrets: SealedSecretTemplate = {
        // For some reason, typescript is not detecting the correct type here.
        // @ts-expect-error
        kind: 'SealedSecret',
        // @ts-expect-error
        apiVersion: 'bitnami.com/v1alpha1',
        metadata: {
            name: unsealedSecretInfo.metadata.name,
            namespace: unsealedSecretInfo.metadata.namespace,
            annotations: {
                'sealedsecrets.bitnami.com/managed': 'true',
            },
        },
        ...existingSealedSecretJsonData,
        spec: {
            encryptedData: {
                ...existingSealedSecretJsonData?.spec?.encryptedData,
                ...filteredSealedSecretsData,
            },
            template: {
                ...existingSealedSecretJsonData?.spec?.template,
                data: null,
                metadata: unsealedSecretInfo.metadata,
                type: unsealedSecretInfo.type,
            },
        },
    };

    // GET SEALED SECRET PATH USING UNSEALED SECRET PATH
    const appManifestsDir = p.dirname(unsealedSecretInfo.path);
    // The path format is: kubernetes/manifests/generated/production/applications/graphql-mongo/1-manifest
    // and we want as basedir: kubernetes/manifests/generated/production/applications/graphql-mongo
    const appBaseDir = p.join(appManifestsDir, '..');
    const sealedSecretDir = p.join(appBaseDir, SEALED_SECRETS_CONTROLLER_NAME);
    const sealedSecretFilePath = p.join(sealedSecretDir, `sealed-secret-${name}-${namespace}.yaml`);

    sh.exec(`echo '${yaml.dump(updatedSealedSecrets)}' > ${sealedSecretFilePath}`);
}


/* 
Gets list of secrets a user wants to update with the CLI
*/
async function getSelectedSecretKeysFromPrompt(environment: Environment): Promise<KubeObjectInfo[]> {
    // Gets all secrets sorting the secret resources in applications namespace first
    const secretsInfo = _.sortBy(getSecretResourceInfo(environment), [(a) => a.metadata.namespace !== 'applications']);
    const sercretObjectsByNamespace = _.groupBy(secretsInfo, (d) => d.metadata.namespace);

    // Name and value have to be defined for inquirer if not using basic string
    const mapToPrompterValues = (secret: KubeObjectInfo): { name: string; value: KubeObjectInfo } => ({
        name: secret?.metadata?.name,
        value: secret,
    });

    /* 
    Create a list of applications separated/grouped by their namespaces
    e.g 
    Namespace  ===> application
         - service 1
         - service 2
         - service 3
    Namespace  ===> infra
         - infra 1
         - infra 2
     */
    const applicationList = Object.entries(sercretObjectsByNamespace).flatMap(([namespace, namespaceSecretObjects]) => [
        new inquirer.Separator(),
        new inquirer.Separator(`Namespace ==> ${namespace} `),
        ...namespaceSecretObjects.map(mapToPrompterValues),
    ]);

    const allResourceAnswerKeyName = 'allSecretResources';
    const { allSecretResources } = await inquirer.prompt<{ [allResourceAnswerKeyName]: KubeObjectInfo[] }>(
        {
            type: 'checkbox',
            message: 'Select resource secret you want to update',
            name: allResourceAnswerKeyName,
            choices: applicationList,
            validate(answer) {
                if (answer.length < 1) {
                    return 'You must choose at least one secret.';
                }

                return true;
            },
            pageSize: 2000,
        },
    );

    // List of secrets keys/names in each kube secret resource.
    // e.g for react-app: [secretKey1, secretKey2, ...]
    const appSecretKeysByNamespace = await promptSecretKeysSelection(allSecretResources);

    return filterSecrets(allSecretResources, appSecretKeysByNamespace);
}



type AppName = ResourceName | string;
type SecretKey = string;
type AppSecretKeysByNamespace = Record<Namespace, Record<AppName, SecretKey[]>>;

async function promptSecretKeysSelection(allSecretResources: KubeObjectInfo[]): Promise<AppSecretKeysByNamespace> {
    const createAppSecretSelectionPrompt = (resource: KubeObjectInfo) => {
        const { name, namespace } = resource.metadata;
        const secrets = resource.stringData ?? resource.data ?? {};
        const secretKeys = Object.keys(secrets);

        return {
            type: 'checkbox',
            name: `${namespace}.${name}`,
            message: chalk.cyanBright(`Select secret - ${name} from the namespace - ${namespace}`),
            choices: secretKeys.flatMap((secretKey) => [new inquirer.Separator(), secretKey]),
            pageSize: 2000,
        };
    };

    return await inquirer.prompt<AppSecretKeysByNamespace>(allSecretResources.map(createAppSecretSelectionPrompt));
}

function filterSecrets(
    allSecretResources: KubeObjectInfo[],
    selectedSecrets: AppSecretKeysByNamespace
): KubeObjectInfo[] {
    return allSecretResources?.map((info) => {
        const { name, namespace } = info.metadata;
        const { stringData, data } = info;

        if (!namespace) {
            throw new Error(`namespace missing for ${name}`);
        }

        if (!stringData && !data) {
            throw new Error('data or stringData field missing in secret Resource');
        }

        const secretDataKeyName = stringData ? 'stringData' : 'data';
        const secretRecord = info[secretDataKeyName] ?? {};

        const selectedSecretsKeys = selectedSecrets[namespace][name];
        let filteredSecretRecords = _.pickBy(secretRecord, (_v, k) => selectedSecretsKeys.includes(k));

        return {
            ...info,
            [secretDataKeyName]: filteredSecretRecords,
        };
    });
}
