// Don't Edit. This is autogenerated.
export interface INatsNats {
	nats: Nats;
	mqtt: Mqtt;
	nameOverride: string;
	namespaceOverride: string;
	imagePullSecrets: any[];
	securityContext: SecurityContext;
	affinity: SecurityContext;
	priorityClassName?: any;
	topologyKeys: any[];
	topologySpreadConstraints: any[];
	podAnnotations: SecurityContext;
	podDisruptionBudget: PodDisruptionBudget;
	nodeSelector: SecurityContext;
	tolerations: any[];
	statefulSetAnnotations: SecurityContext;
	statefulSetPodLabels: SecurityContext;
	serviceAnnotations: SecurityContext;
	additionalContainers: any[];
	additionalVolumes: any[];
	additionalVolumeMounts: any[];
	cluster: Cluster;
	leafnodes: Leafnodes;
	gateway: Gateway;
	bootconfig: Bootconfig;
	natsbox: Natsbox;
	reloader: Reloader;
	exporter: Exporter;
	auth: Auth;
	websocket: Websocket;
	networkPolicy: NetworkPolicy;
	k8sClusterDomain: string;
	useFQDN: boolean;
	commonLabels: SecurityContext;
	podManagementPolicy: string;
}
interface NetworkPolicy {
	enabled: boolean;
	allowExternal: boolean;
	extraIngress: any[];
	extraEgress: any[];
	ingressNSMatchLabels: SecurityContext;
	ingressNSPodMatchLabels: SecurityContext;
}
interface Websocket {
	enabled: boolean;
	port: number;
	noTLS: boolean;
	sameOrigin: boolean;
	allowedOrigins: any[];
}
interface Auth {
	enabled: boolean;
	resolver: Resolver;
}
interface Resolver {
	type: string;
	allowDelete: boolean;
	interval: string;
	operator?: any;
	systemAccount?: any;
	store: Store;
}
interface Store {
	dir: string;
	size: string;
}
interface Exporter {
	enabled: boolean;
	image: string;
	portName: string;
	pullPolicy: string;
	securityContext: SecurityContext;
	resources: SecurityContext;
	serviceMonitor: ServiceMonitor;
}
interface ServiceMonitor {
	enabled: boolean;
	labels: SecurityContext;
	annotations: SecurityContext;
	path: string;
}
interface Reloader {
	enabled: boolean;
	image: string;
	pullPolicy: string;
	securityContext: SecurityContext;
	extraConfigs: any[];
}
interface Natsbox {
	enabled: boolean;
	image: string;
	pullPolicy: string;
	securityContext: SecurityContext;
	additionalLabels: SecurityContext;
	imagePullSecrets: any[];
	podAnnotations: SecurityContext;
	podLabels: SecurityContext;
	affinity: SecurityContext;
	nodeSelector: SecurityContext;
	tolerations: any[];
	extraVolumeMounts: any[];
	extraVolumes: any[];
}
interface Bootconfig {
	image: string;
	pullPolicy: string;
	securityContext: SecurityContext;
}
interface Gateway {
	enabled: boolean;
	port: number;
	name: string;
}
interface Leafnodes {
	enabled: boolean;
	port: number;
	noAdvertise: boolean;
}
interface Cluster {
	enabled: boolean;
	replicas: number;
	noAdvertise: boolean;
	extraRoutes: any[];
}
interface PodDisruptionBudget {
	enabled: boolean;
	maxUnavailable: number;
}
interface Mqtt {
	enabled: boolean;
	ackWait: string;
	maxAckPending: number;
}
interface Nats {
	image: string;
	pullPolicy: string;
	serverNamePrefix: string;
	serverTags?: any;
	profiling: Profiling;
	healthcheck: Healthcheck;
	configChecksumAnnotation: boolean;
	securityContext: SecurityContext;
	externalAccess: boolean;
	advertise: boolean;
	serviceAccount: ServiceAccount;
	connectRetries: number;
	selectorLabels: SecurityContext;
	resources: SecurityContext;
	client: Client;
	limits: Limits;
	terminationGracePeriodSeconds: number;
	logging: Logging;
	jetstream: Jetstream;
}
interface Jetstream {
	enabled: boolean;
	domain?: any;
	uniqueTag?: any;
	encryption?: any;
	memStorage: MemStorage;
	fileStorage: FileStorage;
}
interface FileStorage {
	enabled: boolean;
	storageDirectory: string;
	size: string;
	accessModes: string[];
	annotations?: any;
}
interface MemStorage {
	enabled: boolean;
	size: string;
}
interface Logging {
	debug?: any;
	trace?: any;
	logtime?: any;
	connectErrorReports?: any;
	reconnectErrorReports?: any;
}
interface Limits {
	maxConnections?: any;
	maxSubscriptions?: any;
	maxControlLine?: any;
	maxPayload?: any;
	writeDeadline?: any;
	maxPending?: any;
	maxPings?: any;
	pingInterval?: any;
	lameDuckGracePeriod: string;
	lameDuckDuration: string;
}
interface Client {
	port: number;
	portName: string;
}
interface ServiceAccount {
	create: boolean;
	annotations: SecurityContext;
	name: string;
}
interface SecurityContext {}
interface Healthcheck {
	detectHealthz: boolean;
	enableHealthz: boolean;
	enableHealthzLivenessReadiness: boolean;
	liveness: Liveness;
	readiness: Readiness;
	startup: Readiness;
}
interface Readiness {
	enabled: boolean;
	initialDelaySeconds: number;
	timeoutSeconds: number;
	periodSeconds: number;
	successThreshold: number;
	failureThreshold: number;
}
interface Liveness {
	enabled: boolean;
	initialDelaySeconds: number;
	timeoutSeconds: number;
	periodSeconds: number;
	successThreshold: number;
	failureThreshold: number;
	terminationGracePeriodSeconds?: any;
}
interface Profiling {
	enabled: boolean;
	port: number;
}
