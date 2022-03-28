import * as k8s from "@pulumi/kubernetes";
import { argoCDProvider } from "../shared/cluster";
import { namespaceNames } from "../shared/namespaces";
import { ArgocdHelmValuesBitnami } from "../shared/types/helm-charts/argocdHelmValuesBitnami";
import { DeepPartial, RecursivePartial } from "../shared/types/own-types";

const argocdValues: DeepPartial<ArgocdHelmValuesBitnami> = {
  // fullnameOverride: "argocd",
  // clusterDomain: "https:kubernetes.default.svc",
  // repoServer: {},
  // global: {},
  // config: {
  //   secret: {
  //     githubSecret: "",
  //     repositoryCredentials: {}
  //   }
  // },
  // server: {
  //   url: "https:kubernetes.default.svc",
  // },
};

// `http://${name}.${namespace}:${port}`;
export const argocd = new k8s.helm.v3.Chart(
  "argo-cd",
  {
    chart: "argo-cd",
    fetchOpts: {
      repo: "https://charts.bitnami.com/bitnami",
    },
    version: "2.0.4",
    values: argocdValues,
    namespace: namespaceNames.argocd,
    // namespace: devNamespaceName,
    // By default Release resource will wait till all created resources
    // are available. Set this to true to skip waiting on resources being
    // available.
    skipAwait: false,
  },
  { provider: argoCDProvider }
  // { provider }
);
