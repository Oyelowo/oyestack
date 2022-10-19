// Don't Edit. This is autogenerated.
export interface IArgocdImageUpdaterArgo {
    replicaCount: number;
    image: Image;
    updateStrategy: UpdateStrategy;
    imagePullSecrets: any[];
    nameOverride: string;
    fullnameOverride: string;
    extraArgs: any[];
    extraEnv: any[];
    initContainers: any[];
    volumeMounts: any[];
    volumes: any[];
    config: Config;
    authScripts: AuthScripts;
    serviceAccount: ServiceAccount;
    podAnnotations: SshConfig;
    podSecurityContext: SshConfig;
    securityContext: SshConfig;
    rbac: Rbac;
    resources: SshConfig;
    nodeSelector: SshConfig;
    tolerations: any[];
    affinity: SshConfig;
    metrics: Metrics;
}
interface Metrics {
    enabled: boolean;
    service: Service;
    serviceMonitor: ServiceMonitor;
}
interface ServiceMonitor {
    enabled: boolean;
    interval: string;
    relabelings: any[];
    metricRelabelings: any[];
    selector: SshConfig;
    namespace: string;
    additionalLabels: SshConfig;
}
interface Service {
    annotations: SshConfig;
    labels: SshConfig;
    servicePort: number;
}
interface Rbac {
    enabled: boolean;
}
interface ServiceAccount {
    create: boolean;
    annotations: SshConfig;
    name: string;
}
interface AuthScripts {
    enabled: boolean;
    scripts: SshConfig;
}
interface Config {
    applicationsAPIKind: string;
    argocd: Argocd;
    disableKubeEvents: boolean;
    gitCommitUser: string;
    gitCommitMail: string;
    gitCommitTemplate: string;
    logLevel: string;
    registries: any[];
    sshConfig: SshConfig;
}
interface SshConfig {}
interface Argocd {
    grpcWeb: boolean;
    serverAddress: string;
    insecure: boolean;
    plaintext: boolean;
    token: string;
}
interface UpdateStrategy {
    type: string;
}
interface Image {
    repository: string;
    pullPolicy: string;
    tag: string;
}
