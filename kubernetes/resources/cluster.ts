import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import { Namespace } from "@pulumi/kubernetes/core/v1";

// import { devNamespace } from "./namespaces";

// import * as eks from "@pulumi/eks";

// export const namespace = new k8s.Name;

// const nameSpaceName = "development";
const environment = process.env.ENVIRONMENT;
const nameSpaceName = environment;

//  I am first putting all resources in a single cluster and allocating resources and envronment based on namespace rather than cluster.
// i.e  type Namespace = "development" | "staging" | "production". And only a single cluster.

// If need be, in the future, we can have three providers(clusters): 
// type Cluster = "development" | "staging" | "production".
// while namespace can then be used for categorising resources based on logical grouping or team allocation. e.g 
// type Namespace = "team-a" | "workers" | "web" | "jobs"


export const provider = new k8s.Provider("render-yaml", {
  renderYamlToDirectory: `rendered/${nameSpaceName}`,
  namespace: "nana",
});

// export const devNamespace = new k8s.core.v1.Namespace(
//   "local",
//   {
//     metadata: { name: nameSpaceName, namespace: nameSpaceName },
//   },
//   { provider }
// );
