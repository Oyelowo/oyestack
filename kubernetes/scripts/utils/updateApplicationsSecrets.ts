import { getSecretManifestsPaths, getSecretPathsInfo, SEALED_SECRETS_CONTROLLER_NAME } from './sealedSecrets'
import { SecretTemplate } from '../../resources/shared/types/SecretTemplate'
import { SealedSecretTemplate } from '../../resources/shared/types/sealedSecretTemplate'
import sh from 'shelljs'
import { Environment } from '../../resources/shared/types/own-types'
import yaml from 'js-yaml'
import fs from 'fs'
import c from 'chalk'
import { APPLICATION_AUTOMERGE_ANNOTATION_KEY } from '../../resources/shared/constants'

export function updateAppSealedSecrets(environment: Environment) {
    try {
        getSecretManifestsPaths(environment).forEach((unsealedSecretFilePath) => {
            const { sealedSecretFilePath } = getSecretPathsInfo({
                unsealedSecretFilePath,
            })

            mergeSecretToSealedSecret({
                unsealedSecretFilePath,
                sealedSecretFilePath,
            })
        })
    } catch (error) {
        console.error(
            c.bgRedBright`Path does not exist. Check that you have generated maifestes for that environment. Error: ${error}`
        )
    }
}

type MergeProps = {
    unsealedSecretFilePath: string
    sealedSecretFilePath: string
    // sealedSecretsControllerName: string;
}

export function mergeSecretToSealedSecret({ unsealedSecretFilePath, sealedSecretFilePath }: MergeProps) {
    const unsealedSecretJsonData: SecretTemplate = yaml.load(
        fs.readFileSync(unsealedSecretFilePath, { encoding: 'utf-8' })
    ) as SecretTemplate
    const {
        stringData,
        data,
        metadata: { name, namespace, annotations },
    } = unsealedSecretJsonData

    // We are able to predictably handle merging self-managed secrets
    // As compared with those generated by helm-charts or third party.
    // When the value is empty, those are just skipped. This allows
    // users to only provide the secret value they need for specific application
    // rather than providing all the values. Since after the bootstrapping,
    // we would only mostly be updating application secrets, this would
    // handle most usecases of updating secrets. When we need to
    // update secrets managed by third-party, we can just generate all
    // the sealed secrets and only commit the portions we need but this
    // should not be a common case.
    const isSelfManaged = annotations[APPLICATION_AUTOMERGE_ANNOTATION_KEY] === 'true'

    if (!isSelfManaged) return

    const removeEmptyValue = ([_, value]: [string, string]) => {
        const emptyStringInBase64 = 'Cg=='
        return !(value === '' || value === null || value === emptyStringInBase64)
    }

    const sealValue = ([key, value]: [string, string]) => [
        key,
        sh.exec(
            `echo -n ${value} | kubeseal --controller-name=${SEALED_SECRETS_CONTROLLER_NAME} \
         --raw --from-file=/dev/stdin --namespace ${namespace} \
          --name ${name}`
        ),
    ]

    const dataToSeal = stringData ?? data ?? {}
    const filteredSealedSecretsData = Object.fromEntries(
        Object.entries(dataToSeal).filter(removeEmptyValue).map(sealValue)
    )

    const existingSealedSecretJsonData: SealedSecretTemplate = yaml.load(
        fs.readFileSync(sealedSecretFilePath, { encoding: 'utf-8' })
    ) as SealedSecretTemplate

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
    }

    sh.exec(`echo '${yaml.dump(updatedSealedSecrets)}' > ${sealedSecretFilePath}`)

    // Something as simple as this would have worked but kubeseal doesnt handle merging properly
    // When there is a key in the new secret but not in the existing sealed secret, it throws an error
    // sh.exec(`echo '${JSON.stringify(Data)}' | kubeseal --controller-name ${sealedSecretsControllerName} -o yaml --merge-into  ${sealedSecretFilePath}`)
}
