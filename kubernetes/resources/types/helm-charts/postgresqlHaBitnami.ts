export interface IPostgresqlhabitnami {
    global: Global;
    kubeVersion: string;
    nameOverride: string;
    fullnameOverride: string;
    namespaceOverride: string;
    commonLabels: CommonLabels;
    commonAnnotations: CommonLabels;
    clusterDomain: string;
    extraDeploy: any[];
    diagnosticMode: DiagnosticMode;
    postgresql: Postgresql2;
    pgpool: Pgpool2;
    ldap: Ldap2;
    rbac: Rbac;
    serviceAccount: ServiceAccount;
    psp: Psp;
    metrics: Metrics;
    volumePermissions: VolumePermissions;
    persistence: Persistence;
    service: Service2;
    networkPolicy: NetworkPolicy;
}
interface NetworkPolicy {
    enabled: boolean;
    allowExternal: boolean;
    egressRules: EgressRules;
}
interface EgressRules {
    denyConnectionsToExternal: boolean;
    customRules: any[];
}
interface Service2 {
    type: string;
    ports: ContainerPorts;
    portName: string;
    nodePorts: NodePorts2;
    loadBalancerIP: string;
    loadBalancerSourceRanges: any[];
    clusterIP: string;
    externalTrafficPolicy: string;
    extraPorts: any[];
    sessionAffinity: string;
    sessionAffinityConfig: CommonLabels;
    annotations: CommonLabels;
    serviceLabels: CommonLabels;
}
interface NodePorts2 {
    postgresql: string;
}
interface Persistence {
    enabled: boolean;
    existingClaim: string;
    storageClass: string;
    mountPath: string;
    accessModes: string[];
    size: string;
    annotations: CommonLabels;
    selector: CommonLabels;
}
interface VolumePermissions {
    enabled: boolean;
    image: Image2;
    podSecurityContext: PodSecurityContext3;
    resources: Resources;
}
interface PodSecurityContext3 {
    runAsUser: number;
}
interface Image2 {
    registry: string;
    repository: string;
    tag: string;
    pullPolicy: string;
    pullSecrets: any[];
}
interface Metrics {
    enabled: boolean;
    image: Image;
    podSecurityContext: PodSecurityContext2;
    resources: Resources;
    containerPorts: ContainerPorts2;
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    service: Service;
    annotations: Annotations;
    customMetrics: CommonLabels;
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    serviceMonitor: ServiceMonitor;
}
interface ServiceMonitor {
    enabled: boolean;
    namespace: string;
    interval: string;
    scrapeTimeout: string;
    annotations: CommonLabels;
    labels: CommonLabels;
    selector: Selector;
    relabelings: any[];
    metricRelabelings: any[];
    honorLabels: boolean;
    jobLabel: string;
}
interface Selector {
    prometheus: string;
}
interface Annotations {
    'prometheus.io/scrape': string;
    'prometheus.io/port': string;
}
interface Service {
    type: string;
    ports: Ports;
    nodePorts: NodePorts;
    clusterIP: string;
    loadBalancerIP: string;
    loadBalancerSourceRanges: any[];
    externalTrafficPolicy: string;
}
interface NodePorts {
    metrics: string;
}
interface Ports {
    metrics: number;
}
interface ContainerPorts2 {
    http: number;
}
interface PodSecurityContext2 {
    enabled: boolean;
    runAsUser: number;
}
interface Psp {
    create: boolean;
}
interface ServiceAccount {
    create: boolean;
    name: string;
    annotations: CommonLabels;
    automountServiceAccountToken: boolean;
}
interface Rbac {
    create: boolean;
    rules: any[];
}
interface Ldap2 {
    enabled: boolean;
    existingSecret: string;
    uri: string;
    basedn: string;
    binddn: string;
    bindpw: string;
    bslookup: string;
    scope: string;
    tlsReqcert: string;
    nssInitgroupsIgnoreusers: string;
}
interface Pgpool2 {
    image: Image;
    customUsers: CommonLabels;
    usernames: string;
    passwords: string;
    hostAliases: any[];
    customUsersSecret: string;
    existingSecret: string;
    srCheckDatabase: string;
    labels: CommonLabels;
    podLabels: CommonLabels;
    serviceLabels: CommonLabels;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    command: any[];
    args: any[];
    lifecycleHooks: CommonLabels;
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    initContainers: any[];
    sidecars: any[];
    replicaCount: number;
    podAnnotations: CommonLabels;
    priorityClassName: string;
    schedulerName: string;
    terminationGracePeriodSeconds: string;
    topologySpreadConstraints: any[];
    podAffinityPreset: string;
    podAntiAffinityPreset: string;
    nodeAffinityPreset: NodeAffinityPreset;
    affinity: CommonLabels;
    nodeSelector: CommonLabels;
    tolerations: any[];
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    resources: Resources;
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    pdb: Pdb;
    updateStrategy: CommonLabels;
    containerPorts: ContainerPorts;
    minReadySeconds: string;
    adminUsername: string;
    adminPassword: string;
    usePasswordFile: string;
    authenticationMethod: string;
    logConnections: boolean;
    logHostname: boolean;
    logPerNodeStatement: boolean;
    logLinePrefix: string;
    clientMinMessages: string;
    numInitChildren: string;
    reservedConnections: number;
    maxPool: string;
    childMaxConnections: string;
    childLifeTime: string;
    clientIdleLimit: string;
    connectionLifeTime: string;
    useLoadBalancing: boolean;
    loadBalancingOnWrite: string;
    configuration: string;
    configurationCM: string;
    initdbScripts: CommonLabels;
    initdbScriptsCM: string;
    initdbScriptsSecret: string;
    tls: Tls2;
}
interface Tls2 {
    enabled: boolean;
    autoGenerated: boolean;
    preferServerCiphers: boolean;
    certificatesSecret: string;
    certFilename: string;
    certKeyFilename: string;
    certCAFilename: string;
}
interface Postgresql2 {
    image: Image;
    labels: CommonLabels;
    podLabels: CommonLabels;
    replicaCount: number;
    updateStrategy: UpdateStrategy;
    containerPorts: ContainerPorts;
    hostAliases: any[];
    hostNetwork: boolean;
    hostIPC: boolean;
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
    podSecurityContext: PodSecurityContext;
    containerSecurityContext: ContainerSecurityContext;
    command: any[];
    args: any[];
    lifecycleHooks: CommonLabels;
    extraEnvVars: any[];
    extraEnvVarsCM: string;
    extraEnvVarsSecret: string;
    extraVolumes: any[];
    extraVolumeMounts: any[];
    initContainers: any[];
    sidecars: any[];
    resources: Resources;
    livenessProbe: LivenessProbe;
    readinessProbe: LivenessProbe;
    startupProbe: LivenessProbe;
    customLivenessProbe: CommonLabels;
    customReadinessProbe: CommonLabels;
    customStartupProbe: CommonLabels;
    pdb: Pdb;
    username: string;
    password: string;
    database: string;
    existingSecret: string;
    postgresPassword: string;
    usePasswordFile: string;
    repmgrUsePassfile: string;
    repmgrPassfilePath: string;
    upgradeRepmgrExtension: boolean;
    pgHbaTrustAll: boolean;
    syncReplication: boolean;
    repmgrUsername: string;
    repmgrPassword: string;
    repmgrDatabase: string;
    repmgrLogLevel: string;
    repmgrConnectTimeout: number;
    repmgrReconnectAttempts: number;
    repmgrReconnectInterval: number;
    repmgrFenceOldPrimary: boolean;
    repmgrChildNodesCheckInterval: number;
    repmgrChildNodesConnectedMinCount: number;
    repmgrChildNodesDisconnectTimeout: number;
    usePgRewind: boolean;
    audit: Audit;
    sharedPreloadLibraries: string;
    maxConnections: string;
    postgresConnectionLimit: string;
    dbUserConnectionLimit: string;
    tcpKeepalivesInterval: string;
    tcpKeepalivesIdle: string;
    tcpKeepalivesCount: string;
    statementTimeout: string;
    pghbaRemoveFilters: string;
    extraInitContainers: any[];
    repmgrConfiguration: string;
    configuration: string;
    pgHbaConfiguration: string;
    configurationCM: string;
    extendedConf: string;
    extendedConfCM: string;
    initdbScripts: CommonLabels;
    initdbScriptsCM: string;
    initdbScriptsSecret: string;
    tls: Tls;
}
interface Tls {
    enabled: boolean;
    preferServerCiphers: boolean;
    certificatesSecret: string;
    certFilename: string;
    certKeyFilename: string;
    certCAFilename: string;
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
interface Pdb {
    create: boolean;
    minAvailable: number;
    maxUnavailable: string;
}
interface LivenessProbe {
    enabled: boolean;
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    successThreshold: number;
    failureThreshold: number;
}
interface Resources {
    limits: CommonLabels;
    requests: CommonLabels;
}
interface ContainerSecurityContext {
    enabled: boolean;
    runAsUser: number;
    runAsNonRoot: boolean;
    readOnlyRootFilesystem: boolean;
}
interface PodSecurityContext {
    enabled: boolean;
    fsGroup: number;
}
interface NodeAffinityPreset {
    type: string;
    key: string;
    values: any[];
}
interface ContainerPorts {
    postgresql: number;
}
interface UpdateStrategy {
    type: string;
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
    ldap: Ldap;
    pgpool: Pgpool;
}
interface Pgpool {
    adminUsername: string;
    adminPassword: string;
    existingSecret: string;
}
interface Ldap {
    bindpw: string;
    existingSecret: string;
}
interface Postgresql {
    username: string;
    password: string;
    database: string;
    repmgrUsername: string;
    repmgrPassword: string;
    repmgrDatabase: string;
    existingSecret: string;
}
