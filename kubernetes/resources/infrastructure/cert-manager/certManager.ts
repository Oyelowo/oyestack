import * as k8s from "@pulumi/kubernetes";
import { getCertManagerControllerDir, getRepoPathFromAbsolutePath } from "../../shared/manifestsDirectory";
import { createArgocdApplication } from "../../shared/createArgoApplication";
import { namespaceNames } from "../../shared/namespaces";
import { ArgocdHelmValuesBitnami } from "../../shared/types/helm-charts/argocdHelmValuesBitnami";
import { DeepPartial } from "../../shared/types/own-types";
import { getEnvironmentVariables } from "../../shared/validations";
import { CertManagerValuesJetspack } from "../../shared/types/helm-charts/certManagerValuesJetspack";
import { CertManagerValuesBitnami } from "../../shared/types/helm-charts/certManagerValuesBitnami";

const { ENVIRONMENT } = getEnvironmentVariables();
const certManagerControllerDir = getCertManagerControllerDir(ENVIRONMENT);

type Metadata = {
  name: string;
  namespace: string;
};
const metadata: Metadata = {
  name: "cert-manager",
  namespace: namespaceNames.argocd,
};

const resourceName = metadata.name;

// App that deploys argocd resources themselves
/* ARGOCD APPLICATION ITSELF RESPONSIBLE FOR DECLARATIVELY DEPLOYING ARGO CONTROLLER RESOURCES */

export const certManagerControllerProvider = new k8s.Provider(certManagerControllerDir, {
  renderYamlToDirectory: certManagerControllerDir,
});

// export const argoApplicationSecret = new k8s.

// CertManagerValuesBitnami
const certManagerValuesB: DeepPartial<CertManagerValuesBitnami> = {
  // fullnameOverride: "cert-manager",
  fullnameOverride: "cert-manager",
  installCRDs: true
};
const certManagerValues: DeepPartial<CertManagerValuesJetspack> = {
  // fullnameOverride: "cert-manager",
  installCRDs: true
};

// `http://${name}.${namespace}:${port}`;
export const argocdHelm = new k8s.helm.v3.Chart(
  "argocd",
  {
    chart: "argo-cd",
    fetchOpts: {
      repo: "https://charts.bitnami.com/bitnami",
    },
    version: "3.1.12",
    values: certManagerValues,
    namespace: namespaceNames.argocd,
    // namespace: devNamespaceName,
    // By default Release resource will wait till all created resources
    // are available. Set this to true to skip waiting on resources being
    // available.
    skipAwait: false,
  },
  { provider: certManagerControllerProvider }
  // { provider }
);
