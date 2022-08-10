import { Environment } from '../../src/resources/types/ownTypes.js';
import { PlainSecretJsonConfig } from '../utils/plainSecretJsonConfig.js';
import sh from 'shelljs';
import { promptSecretsDeletionConfirmations } from '../utils/promptSecretsDeletionConfirmations.js';
import { namespaces } from '../../src/resources/infrastructure/namespaces/util.js';
import { helmChartsInfo } from '../../src/resources/shared/helmChartInfo.js';
import { ResourceName } from '../../src/resources/types/ownTypes.js';
import _ from 'lodash';
import { KubeObject } from '../utils/kubeObject/kubeObject.js';

export async function setupCluster(environment: Environment) {
    const { deletPlainJsonSecretsInput, deleteUnsealedSecretManifestsOutput } =
        await promptSecretsDeletionConfirmations();

    const kubeObject = new KubeObject(environment);
    await kubeObject.generateManifests();

    PlainSecretJsonConfig.syncAll();

    applySetupManifests(kubeObject);

    if (deletPlainJsonSecretsInput) {
        PlainSecretJsonConfig.resetValues(environment);
    }

    if (deleteUnsealedSecretManifestsOutput) {
        kubeObject.getOfAKind('Secret').forEach((o) => {
            sh.rm('-rf', o.path);
        });
    }
}

function applySetupManifests(kubeObject: KubeObject) {
    // # Apply namespace first
    applyResourceManifests('namespaces', kubeObject);

    // # Apply setups with sealed secret controller
    applyResourceManifests('sealed-secrets', kubeObject);

    const sealedSecretsName: ResourceName = 'sealed-secrets';
    // # Wait for bitnami sealed secrets controller to be in running phase so that we can use it to encrypt secrets
    sh.exec(`kubectl rollout status deployment/${sealedSecretsName} -n=${namespaces.kubeSystem}`);

    kubeObject.syncSealedSecrets();

    // # Apply setups with cert-manager controller
    applyResourceManifests('cert-manager', kubeObject);

    // # Wait for cert-manager and cert-manager-trust controllers to be in running phase so that we can use it to encrypt secrets
    const { certManager, certManagerTrust } = helmChartsInfo.jetstack.charts;
    sh.exec(`kubectl rollout status deployment/${certManager.chart} -n=${namespaces.certManager}`);
    sh.exec(`kubectl rollout status deployment/${certManagerTrust.chart} -n=${namespaces.certManager}`);

    // Reapply cert-manager in case something did not apply the first time e.g the cert-managerr-trust
    // needs to be ready for Bundle to be applied
    applyResourceManifests('cert-manager', kubeObject);

    // # Apply setups with linkerd controller
    applyResourceManifests('linkerd', kubeObject);
    applyResourceManifests('linkerd-viz', kubeObject);

    // For automated deployment, Use skaffold locally and argocd in other environments
    if (kubeObject.getEnvironment() !== 'local') {
        applyResourceManifests('argocd', kubeObject);

        sh.exec('kubectl -n argocd rollout restart deployment argocd-argo-cd-server');

        applyResourceManifests('argocd-applications-parents', kubeObject);
    }
}

function applyResourceManifests(resourceName: ResourceName, kubeObject: KubeObject) {
    const resource = kubeObject.getForApp(resourceName);

    // put crds and sealed secret resources first
    const manifestsToApply = _.sortBy(resource, [
        (m) => m.kind !== 'CustomResourceDefinition',
        (m) => m.kind !== 'SealedSecret',
    ]);

    manifestsToApply.forEach((o) => sh.exec(`kubectl apply -f  ${o.path}`));
}
