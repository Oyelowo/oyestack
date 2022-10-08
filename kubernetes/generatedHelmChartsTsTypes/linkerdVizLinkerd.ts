// Don't Edit. This is autogenerated.
export interface ILinkerdvizlinkerd {
    linkerdVersion: string;
    clusterDomain: string;
    identityTrustDomain: string;
    defaultRegistry: string;
    defaultImagePullPolicy: string;
    defaultLogLevel: string;
    defaultLogFormat: string;
    defaultUID: number;
    linkerdNamespace: string;
    nodeSelector: NodeSelector;
    imagePullSecrets: any[];
    tolerations?: any;
    enablePodAntiAffinity: boolean;
    enablePSP: boolean;
    prometheusUrl: string;
    jaegerUrl: string;
    metricsAPI: MetricsAPI;
    tap: Tap;
    tapInjector: TapInjector;
    dashboard: Dashboard;
    grafana: Grafana;
    prometheus: Prometheus;
}
interface Prometheus {
    enabled: boolean;
    image: Image;
    logLevel: string;
    logFormat: string;
    args: Args;
    globalConfig: GlobalConfig;
    alertRelabelConfigs?: any;
    alertmanagers?: any;
    remoteWrite?: any;
    ruleConfigMapMounts?: any;
    scrapeConfigs?: any;
    sidecarContainers?: any;
    resources: Resources;
    proxy?: any;
    nodeSelector: NodeSelector;
    tolerations?: any;
}
interface GlobalConfig {
    scrape_interval: string;
    scrape_timeout: string;
    evaluation_interval: string;
}
interface Args {
    'storage.tsdb.path': string;
    'storage.tsdb.retention.time': string;
    'config.file': string;
}
interface Grafana {
    url?: any;
    externalUrl?: any;
    uidPrefix?: any;
}
interface Dashboard {
    replicas: number;
    logLevel: string;
    logFormat: string;
    image: Image;
    UID?: any;
    restrictPrivileges: boolean;
    enforcedHostRegexp: string;
    resources: Resources;
    proxy?: any;
}
interface TapInjector {
    replicas: number;
    logLevel: string;
    logFormat: string;
    image: Image;
    namespaceSelector?: any;
    objectSelector?: any;
    UID?: any;
    failurePolicy: string;
    resources: Resources;
    proxy?: any;
    externalSecret: boolean;
    crtPEM: string;
    keyPEM: string;
    caBundle: string;
    injectCaFrom: string;
    injectCaFromSecret: string;
}
interface Tap {
    replicas: number;
    logLevel: string;
    logFormat: string;
    image: Image;
    externalSecret: boolean;
    crtPEM: string;
    keyPEM: string;
    caBundle: string;
    injectCaFrom: string;
    injectCaFromSecret: string;
    resources: Resources;
    proxy?: any;
    UID?: any;
}
interface MetricsAPI {
    replicas: number;
    logLevel: string;
    logFormat: string;
    image: Image;
    resources: Resources;
    proxy?: any;
    UID?: any;
    nodeSelector: NodeSelector;
    tolerations?: any;
}
interface Resources {
    cpu: Cpu;
    memory: Cpu;
    'ephemeral-storage': Ephemeralstorage;
}
interface Ephemeralstorage {
    limit: string;
    request: string;
}
interface Cpu {
    limit?: any;
    request?: any;
}
interface Image {
    registry: string;
    name: string;
    tag: string;
    pullPolicy: string;
}
interface NodeSelector {
    'kubernetes.io/os': string;
}
