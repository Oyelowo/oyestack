// import * as cm from "../../../crd2pulumi/certManager/certmanager"
// import { namespaceNames } from "../../shared"
// import { CLUSTER_ISSUER_NAME } from "../cert-manager/clusterIssuer";
// import { DNS_NAME_LINODE_BASE } from "./constant"
// import { ingressControllerProvider } from "./ingressController";


// export const SECRET_NAME_NGINX = "nginx-ingress-tls";

// export const certificateNginx = new cm.v1.Certificate("certificate-nginx", {
//     metadata: {
//         name: "certificate-nginx",
//         namespace: namespaceNames.default
//     },
//     spec: {
//         dnsNames: [DNS_NAME_LINODE_BASE],
//         secretName: SECRET_NAME_NGINX,
//         issuerRef: {
//             name: CLUSTER_ISSUER_NAME,
//             kind: "ClusterIssuer"
//         }
//     }
// }, { provider: ingressControllerProvider })