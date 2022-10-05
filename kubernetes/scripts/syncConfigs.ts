import { KubeObject } from './utils/kubeObject/kubeObject.js';
import { PlainSecretsManager } from './utils/plainSecretsManager';
import { syncEtcHostsWithCustomHosts } from './utils/syncEtcHostsWithCustomHosts.js';
import { syncHelmChartTypesDeclarations } from './utils/syncHelmChartTypesDeclarations.js';

async function main() {
    syncEtcHostsWithCustomHosts();
    syncHelmChartTypesDeclarations();

    PlainSecretsManager.syncAll();

    // Use local manifests to syn/generate new CRD codes
    const kubeObjectInstance = new KubeObject('local');
    // This also takes care of syncing crds because we want
    // to make sure they're generated from most up-to-date manifests.
    await kubeObjectInstance.generateManifests();
}

await main();
