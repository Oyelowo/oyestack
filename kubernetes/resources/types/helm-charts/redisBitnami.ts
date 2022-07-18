// Don't Edit. This is autogenerated.
export interface IRedisbitnami {
    global: Global;
    kubeVersion: string;
    nameOverride: string;
    fullnameOverride: string;
    commonLabels: CommonLabels;
    commonAnnotations: CommonLabels;
    secretAnnotations: CommonLabels;
    clusterDomain: string;
    extraDeploy: any[];
    diagnosticMode: DiagnosticMode;
    image: Image;
    architecture: string;
    auth: Auth;
    commonConfiguration: string;
    existingConfigmap: string;
    master: Master;
    replica: Replica;
    sentinel: Sentinel;
    networkPolicy: NetworkPolicy;
    podSecurityPolicy: PodSecurityPolicy;
    rbac: Rbac;
    serviceAccount: ServiceAccount;
    pdb: Pdb;
    tls: Tls;
    metrics: Metrics;
    volumePermissions: VolumePermissions;
    sysctl: Sysctl;
    useExternalDNS: UseExternalDNS;
}
interface UseExternalDNS {
    enabled: boolean;
    suffix: string;
    annotationKey: string;
    additionalAnnotations: CommonLabels;
}
interface Sysctl {
    enabled: boolean;
    image: Image2;
    command: any[];
    mountHostSys: boolean;
    resources: Resources;
}
interface VolumePermissions {
    enabled: boolean;
    image: Image2;
    resources: Resources;
    containerSecurityContext: ContainerSecurityContext2;
}
interface ContainerSecurityContext2 {
    runAsUser: number;
}
interface Metrics {
    enabled: boolean;
    image: Image2;
    command: any[];
    redisTargetHost: string;
    extraArgs: CommonLabels;
    extraEnvVars: any[];
    containerSecurityContext: ContainerSecurityContext;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    resources: Resources;
    podLabels: CommonLabels;
    podAnnotations: PodAnnotations;
    service: Service3;
    serviceMonitor: ServiceMonitor;
    prometheusRule: PrometheusRule;
}
interface PrometheusRule {
    enabled: boolean;
    namespace: string;
    additionalLabels: CommonLabels;
    rules: any[];
}
interface ServiceMonitor {
    enabled: boolean;
    namespace: string;
    interval: string;
    scrapeTimeout: string;
    relabellings: any[];
    metricRelabelings: any[];
    honorLabels: boolean;
    additionalLabels: CommonLabels;
}
interface Service3 {
    type: string;
    port: number;
    externalTrafficPolicy: string;
    extraPorts: any[];
    loadBalancerIP: string;
    loadBalancerSourceRanges: any[];
    annotations: CommonLabels;
}
interface PodAnnotations {
    'prometheus.io/scrape': string;
    'prometheus.io/port': string;
}
interface Image2 {
    registry: string;
    repository: string;
    tag: string;
    pullPolicy: string;
    pullSecrets: any[];
}
interface Tls {
    enabled: boolean;
    authClients: boolean;
    autoGenerated: boolean;
    existingSecret: string;
    certificatesSecret: string;
    certFilename: string;
    certKeyFilename: string;
    certCAFilename: string;
    dhParamsFilename: string;
}
interface Pdb {
    create: boolean;
    minAvailable: number;
    maxUnavailable: string;
}
interface ServiceAccount {
    create: boolean;
    name: string;
    automountServiceAccountToken: boolean;
    annotations: CommonLabels;
}
interface Rbac {
    create: boolean;
    rules: any[];
}
interface PodSecurityPolicy {
    create: boolean;
    enabled: boolean;
}
interface NetworkPolicy {
    enabled: boolean;
    allowExternal: boolean;
    extraIngress: any[];
    extraEgress: any[];
    ingressNSMatchLabels: CommonLabels;
    ingressNSPodMatchLabels: CommonLabels;
}
interface Sentinel {
    enabled: boolean;
    image: Image;
    masterSet: string;
    quorum: number;
    getMasterTimeout: number;
    automateClusterRecovery: boolean;
    downAfterMilliseconds: number;
    failoverTimeout: number;
    parallelSyncs: number;
    configuration: string;
    command: any[];
    args: any[];
    preExecCmds: any[];
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    externalMaster: ExternalMaster;
    containerPorts: ContainerPorts2;
    startupProbe: StartupProbe;
    livenessProbe: StartupProbe;
    readinessProbe: StartupProbe;
    customStartupProbe: CommonLabels;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    persistence: Persistence3;
    resources: Resources;
    containerSecurityContext: ContainerSecurityContext;
    lifecycleHooks: CommonLabels;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    service: Service2;
    terminationGracePeriodSeconds: number;
}
interface Service2 {
    type: string;
    ports: Ports;
    nodePorts: NodePorts2;
    externalTrafficPolicy: string;
    extraPorts: any[];
    clusterIP: string;
    loadBalancerIP: string;
    loadBalancerSourceRanges: any[];
    annotations: CommonLabels;
}
interface NodePorts2 {
    redis: string;
    sentinel: string;
}
interface Ports {
    redis: number;
    sentinel: number;
}
interface Persistence3 {
    enabled: boolean;
    storageClass: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
    dataSource: CommonLabels;
}
interface ContainerPorts2 {
    sentinel: number;
}
interface Replica {
    replicaCount: number;
    configuration: string;
    disableCommands: string[];
    command: any[];
    args: any[];
    preExecCmds: any[];
    extraFlags: any[];
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    externalMaster: ExternalMaster;
    containerPorts: ContainerPorts;
    startupProbe: StartupProbe;
    livenessProbe: StartupProbe;
    readinessProbe: StartupProbe;
    customStartupProbe: CommonLabels;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    resources: Resources;
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    schedulerName: string;
    updateStrategy: UpdateStrategy;
    priorityClassName: string;
    podManagementPolicy: string;
    hostAliases: any[];
    podLabels: CommonLabels;
    podAnnotations: CommonLabels;
    shareProcessNamespace: boolean;
    podAffinityPreset: string;
    podAntiAffinityPreset: string;
    nodeAffinityPreset: NodeAffinityPreset;
    affinity: CommonLabels;
    nodeSelector: CommonLabels;
    tolerations: any[];
    topologySpreadConstraints: any[];
    dnsPolicy: string;
    dnsConfig: CommonLabels;
    lifecycleHooks: CommonLabels;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    sidecars: any[];
    initContainers: any[];
    persistence: Persistence2;
    service: Service;
    terminationGracePeriodSeconds: number;
    autoscaling: Autoscaling;
}
interface Autoscaling {
    enabled: boolean;
    minReplicas: number;
    maxReplicas: number;
    targetCPU: string;
    targetMemory: string;
}
interface Persistence2 {
    enabled: boolean;
    medium: string;
    path: string;
    subPath: string;
    storageClass: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
    dataSource: CommonLabels;
}
interface ExternalMaster {
    enabled: boolean;
    host: string;
    port: number;
}
interface Master {
    configuration: string;
    disableCommands: string[];
    command: any[];
    args: any[];
    preExecCmds: any[];
    extraFlags: any[];
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    containerPorts: ContainerPorts;
    startupProbe: StartupProbe;
    livenessProbe: StartupProbe;
    readinessProbe: StartupProbe;
    customStartupProbe: CommonLabels;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    resources: Resources;
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    kind: string;
    schedulerName: string;
    updateStrategy: UpdateStrategy;
    priorityClassName: string;
    hostAliases: any[];
    podLabels: CommonLabels;
    podAnnotations: CommonLabels;
    shareProcessNamespace: boolean;
    podAffinityPreset: string;
    podAntiAffinityPreset: string;
    nodeAffinityPreset: NodeAffinityPreset;
    affinity: CommonLabels;
    nodeSelector: CommonLabels;
    tolerations: any[];
    topologySpreadConstraints: any[];
    dnsPolicy: string;
    dnsConfig: CommonLabels;
    lifecycleHooks: CommonLabels;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    sidecars: any[];
    initContainers: any[];
    persistence: Persistence;
    service: Service;
    terminationGracePeriodSeconds: number;
}
interface Service {
    type: string;
    ports: ContainerPorts;
    nodePorts: NodePorts;
    externalTrafficPolicy: string;
    internalTrafficPolicy: string;
    extraPorts: any[];
    clusterIP: string;
    loadBalancerIP: string;
    loadBalancerSourceRanges: any[];
    annotations: CommonLabels;
}
interface NodePorts {
    redis: string;
}
interface Persistence {
    enabled: boolean;
    medium: string;
    sizeLimit: string;
    path: string;
    subPath: string;
    storageClass: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
    dataSource: CommonLabels;
    existingClaim: string;
}
interface NodeAffinityPreset {
    type: string;
    key: string;
    values: any[];
}
interface UpdateStrategy {
    type: string;
    rollingUpdate: CommonLabels;
}
interface ContainerSecurityContext {
    enabled: boolean;
    runAsUser: number;
}
interface PodSecurityContext {
    enabled: boolean;
    fsGroup: number;
}
interface Resources {
    limits: CommonLabels;
    requests: CommonLabels;
}
interface StartupProbe {
    enabled: boolean;
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    successThreshold: number;
    failureThreshold: number;
}
interface ContainerPorts {
    redis: number;
}
interface Auth {
    enabled: boolean;
    sentinel: boolean;
    password: string;
    existingSecret: string;
    existingSecretPasswordKey: string;
    usePasswordFiles: boolean;
}
interface Image {
    registry: string;
    repository: string;
    tag: string;
    pullPolicy: string;
    pullSecrets: any[];
    debug: boolean;
}
interface DiagnosticMode {
    enabled: boolean;
    command: string[];
    args: string[];
}
interface CommonLabels {}
interface Global {
    imageRegistry: string;
    imagePullSecrets: any[];
    storageClass: string;
    redis: Redis;
}
interface Redis {
    password: string;
}
