// Don't Edit. This is autogenerated.
export interface IArgoEventsArgo {
    nameOverride: string;
    fullnameOverride: string;
    openshift: boolean;
    createAggregateRoles: boolean;
    crds: Crds;
    global: Global;
    configs: Configs;
    controller: Controller;
    webhook: Webhook;
}
interface Webhook {
    enabled: boolean;
    name: string;
    image: Image;
    replicas: number;
    pdb: Pdb;
    env: any[];
    envFrom: any[];
    podAnnotations: Annotations;
    podLabels: Annotations;
    containerSecurityContext: Annotations;
    readinessProbe: ReadinessProbe;
    livenessProbe: ReadinessProbe;
    volumeMounts: any[];
    volumes: any[];
    nodeSelector: Annotations;
    tolerations: any[];
    affinity: Annotations;
    topologySpreadConstraints: any[];
    priorityClassName: string;
    resources: Annotations;
    serviceAccount: ServiceAccount;
}
interface Controller {
    name: string;
    rbac: Rbac;
    image: Image;
    replicas: number;
    pdb: Pdb;
    env: any[];
    envFrom: any[];
    podAnnotations: Annotations;
    podLabels: Annotations;
    containerSecurityContext: Annotations;
    readinessProbe: ReadinessProbe;
    livenessProbe: ReadinessProbe;
    volumes: any[];
    volumeMounts: any[];
    nodeSelector: Annotations;
    tolerations: any[];
    affinity: Annotations;
    topologySpreadConstraints: any[];
    priorityClassName: string;
    resources: Annotations;
    extraContainers: any[];
    initContainers: any[];
    serviceAccount: ServiceAccount;
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
    selector: Annotations;
    namespace: string;
    additionalLabels: Annotations;
}
interface Service {
    annotations: Annotations;
    labels: Annotations;
    servicePort: number;
}
interface ServiceAccount {
    create: boolean;
    name: string;
    annotations: Annotations;
    automountServiceAccountToken: boolean;
}
interface ReadinessProbe {
    failureThreshold: number;
    initialDelaySeconds: number;
    periodSeconds: number;
    successThreshold: number;
    timeoutSeconds: number;
}
interface Pdb {
    enabled: boolean;
    labels: Annotations;
    annotations: Annotations;
}
interface Rbac {
    enabled: boolean;
    namespaced: boolean;
    rules: any[];
}
interface Configs {
    nats: Nats;
    jetstream: Jetstream;
}
interface Jetstream {
    settings: Settings;
    streamConfig: StreamConfig;
    versions: Version2[];
}
interface Version2 {
    version: string;
    natsImage: string;
    metricsExporterImage: string;
    configReloaderImage: string;
    startCommand: string;
}
interface StreamConfig {
    maxMsgs: number;
    maxAge: string;
    maxBytes: string;
    replicas: number;
    duplicates: string;
}
interface Settings {
    maxMemoryStore: number;
    maxFileStore: number;
}
interface Nats {
    versions: Version[];
}
interface Version {
    version: string;
    natsStreamingImage: string;
    metricsExporterImage: string;
}
interface Global {
    image: Image;
    imagePullSecrets: any[];
    podAnnotations: Annotations;
    podLabels: Annotations;
    additionalLabels: Annotations;
    securityContext: Annotations;
    hostAliases: any[];
}
interface Image {
    repository: string;
    tag: string;
    imagePullPolicy: string;
}
interface Crds {
    install: boolean;
    keep: boolean;
    annotations: Annotations;
}
interface Annotations {}
