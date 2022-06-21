export interface IPostgresqlbitnami {
    global: Global;
    kubeVersion: string;
    nameOverride: string;
    fullnameOverride: string;
    clusterDomain: string;
    extraDeploy: any[];
    commonLabels: CommonLabels;
    commonAnnotations: CommonLabels;
    diagnosticMode: DiagnosticMode;
    image: Image;
    auth: Auth2;
    architecture: string;
    replication: Replication;
    containerPorts: ContainerPorts;
    audit: Audit;
    ldap: Ldap;
    postgresqlDataDir: string;
    postgresqlSharedPreloadLibraries: string;
    shmVolume: ShmVolume;
    tls: Tls2;
    primary: Primary;
    readReplicas: ReadReplicas;
    networkPolicy: NetworkPolicy;
    volumePermissions: VolumePermissions;
    serviceAccount: ServiceAccount;
    rbac: Rbac;
    psp: Psp;
    metrics: Metrics2;
}
interface Metrics2 {
    enabled: boolean;
    image: Image2;
    customMetrics: CommonLabels;
    extraEnvVars: any[];
    containerSecurityContext: ContainerSecurityContext3;
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    containerPorts: ContainerPorts2;
    resources: Resources2;
    service: Service3;
    serviceMonitor: ServiceMonitor;
    prometheusRule: PrometheusRule;
}
interface PrometheusRule {
    enabled: boolean;
    namespace: string;
    labels: CommonLabels;
    rules: any[];
}
interface ServiceMonitor {
    enabled: boolean;
    namespace: string;
    interval: string;
    scrapeTimeout: string;
    labels: CommonLabels;
    selector: CommonLabels;
    relabelings: any[];
    metricRelabelings: any[];
    honorLabels: boolean;
    jobLabel: string;
}
interface Service3 {
    ports: ContainerPorts2;
    clusterIP: string;
    sessionAffinity: string;
    annotations: Annotations;
}
interface Annotations {
    'prometheus.io/scrape': string;
    'prometheus.io/port': string;
}
interface ContainerPorts2 {
    metrics: number;
}
interface ContainerSecurityContext3 {
    enabled: boolean;
    runAsUser: number;
    runAsNonRoot: boolean;
}
interface Psp {
    create: boolean;
}
interface Rbac {
    create: boolean;
    rules: any[];
}
interface ServiceAccount {
    create: boolean;
    name: string;
    automountServiceAccountToken: boolean;
    annotations: CommonLabels;
}
interface VolumePermissions {
    enabled: boolean;
    image: Image2;
    resources: Resources2;
    containerSecurityContext: ContainerSecurityContext2;
}
interface ContainerSecurityContext2 {
    runAsUser: number;
}
interface Resources2 {
    limits: CommonLabels;
    requests: CommonLabels;
}
interface Image2 {
    registry: string;
    repository: string;
    tag: string;
    pullPolicy: string;
    pullSecrets: any[];
}
interface NetworkPolicy {
    enabled: boolean;
    metrics: Metrics;
    ingressRules: IngressRules;
    egressRules: EgressRules;
}
interface EgressRules {
    denyConnectionsToExternal: boolean;
    customRules: CommonLabels;
}
interface IngressRules {
    primaryAccessOnlyFrom: PrimaryAccessOnlyFrom;
    readReplicasAccessOnlyFrom: PrimaryAccessOnlyFrom;
}
interface PrimaryAccessOnlyFrom {
    enabled: boolean;
    namespaceSelector: CommonLabels;
    podSelector: CommonLabels;
    customRules: CommonLabels;
}
interface Metrics {
    enabled: boolean;
    namespaceSelector: CommonLabels;
    podSelector: CommonLabels;
}
interface ReadReplicas {
    replicaCount: number;
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    command: any[];
    args: any[];
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    lifecycleHooks: CommonLabels;
    resources: Resources;
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    hostAliases: any[];
    hostNetwork: boolean;
    hostIPC: boolean;
    labels: CommonLabels;
    annotations: CommonLabels;
    podLabels: CommonLabels;
    podAnnotations: CommonLabels;
    podAffinityPreset: string;
    podAntiAffinityPreset: string;
    nodeAffinityPreset: NodeAffinityPreset;
    affinity: CommonLabels;
    nodeSelector: CommonLabels;
    tolerations: any[];
    topologySpreadConstraints: any[];
    priorityClassName: string;
    schedulerName: string;
    terminationGracePeriodSeconds: string;
    updateStrategy: UpdateStrategy;
    extraVolumeMounts: any[];
    extraVolumes: any[];
    sidecars: any[];
    initContainers: any[];
    extraPodSpec: CommonLabels;
    service: Service2;
    persistence: Persistence2;
}
interface Persistence2 {
    enabled: boolean;
    mountPath: string;
    subPath: string;
    storageClass: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
    dataSource: CommonLabels;
}
interface Primary {
    configuration: string;
    pgHbaConfiguration: string;
    existingConfigmap: string;
    extendedConfiguration: string;
    existingExtendedConfigmap: string;
    initdb: Initdb;
    standby: Standby;
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    command: any[];
    args: any[];
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    lifecycleHooks: CommonLabels;
    resources: Resources;
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    hostAliases: any[];
    hostNetwork: boolean;
    hostIPC: boolean;
    labels: CommonLabels;
    annotations: CommonLabels;
    podLabels: CommonLabels;
    podAnnotations: CommonLabels;
    podAffinityPreset: string;
    podAntiAffinityPreset: string;
    nodeAffinityPreset: NodeAffinityPreset;
    affinity: CommonLabels;
    nodeSelector: CommonLabels;
    tolerations: any[];
    topologySpreadConstraints: any[];
    priorityClassName: string;
    schedulerName: string;
    terminationGracePeriodSeconds: string;
    updateStrategy: UpdateStrategy;
    extraVolumeMounts: any[];
    extraVolumes: any[];
    sidecars: any[];
    initContainers: any[];
    extraPodSpec: CommonLabels;
    service: Service2;
    persistence: Persistence;
}
interface Persistence {
    enabled: boolean;
    existingClaim: string;
    mountPath: string;
    subPath: string;
    storageClass: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
    dataSource: CommonLabels;
}
interface Service2 {
    type: string;
    ports: ContainerPorts;
    nodePorts: Ports;
    clusterIP: string;
    annotations: CommonLabels;
    loadBalancerIP: string;
    externalTrafficPolicy: string;
    loadBalancerSourceRanges: any[];
    extraPorts: any[];
    sessionAffinity: string;
    sessionAffinityConfig: CommonLabels;
}
interface UpdateStrategy {
    type: string;
    rollingUpdate: CommonLabels;
}
interface NodeAffinityPreset {
    type: string;
    key: string;
    values: any[];
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
    requests: Requests;
}
interface Requests {
    memory: string;
    cpu: string;
}
interface LivenessProbe {
    enabled: boolean;
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    failureThreshold: number;
    successThreshold: number;
}
interface Standby {
    enabled: boolean;
    primaryHost: string;
    primaryPort: string;
}
interface Initdb {
    args: string;
    postgresqlWalDir: string;
    scripts: CommonLabels;
    scriptsConfigMap: string;
    scriptsSecret: string;
    user: string;
    password: string;
}
interface Tls2 {
    enabled: boolean;
    autoGenerated: boolean;
    preferServerCiphers: boolean;
    certificatesSecret: string;
    certFilename: string;
    certKeyFilename: string;
    certCAFilename: string;
    crlFilename: string;
}
interface ShmVolume {
    enabled: boolean;
    sizeLimit: string;
}
interface Ldap {
    enabled: boolean;
    server: string;
    port: string;
    prefix: string;
    suffix: string;
    basedn: string;
    binddn: string;
    bindpw: string;
    searchAttribute: string;
    searchFilter: string;
    scheme: string;
    tls: Tls;
    uri: string;
}
interface Tls {
    enabled: boolean;
}
interface Audit {
    logHostname: boolean;
    logConnections: boolean;
    logDisconnections: boolean;
    pgAuditLog: string;
    pgAuditLogCatalog: string;
    clientMinMessages: string;
    logLinePrefix: string;
    logTimezone: string;
}
interface ContainerPorts {
    postgresql: number;
}
interface Replication {
    synchronousCommit: string;
    numSynchronousReplicas: number;
    applicationName: string;
}
interface Auth2 {
    enablePostgresUser: boolean;
    postgresPassword: string;
    username: string;
    password: string;
    database: string;
    replicationUsername: string;
    replicationPassword: string;
    existingSecret: string;
    secretKeys: SecretKeys;
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
    postgresql: Postgresql;
}
interface Postgresql {
    auth: Auth;
    service: Service;
}
interface Service {
    ports: Ports;
}
interface Ports {
    postgresql: string;
}
interface Auth {
    postgresPassword: string;
    username: string;
    password: string;
    database: string;
    existingSecret: string;
    secretKeys: SecretKeys;
}
interface SecretKeys {
    adminPasswordKey: string;
    userPasswordKey: string;
    replicationPasswordKey: string;
}
