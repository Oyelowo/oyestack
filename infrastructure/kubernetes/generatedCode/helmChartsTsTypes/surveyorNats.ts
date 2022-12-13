// Don't Edit. This is autogenerated.
export interface ISurveyorNats {
	replicaCount: number;
	image: Image;
	imagePullSecrets: any[];
	nameOverride: string;
	fullnameOverride: string;
	podAnnotations: PodAnnotations;
	podSecurityContext: PodAnnotations;
	securityContext: PodAnnotations;
	service: Service;
	serviceMonitor: ServiceMonitor;
	ingress: Ingress;
	resources: PodAnnotations;
	autoscaling: Autoscaling;
	nodeSelector: PodAnnotations;
	tolerations: any[];
	affinity: PodAnnotations;
	config: Config;
}
interface Config {
	servers: string;
	timeout: string;
	expectedServers: number;
	accounts: boolean;
	jetstream: Jetstream;
}
interface Jetstream {
	enabled: boolean;
}
interface Autoscaling {
	enabled: boolean;
	minReplicas: number;
	maxReplicas: number;
	targetCPUUtilizationPercentage: number;
}
interface Ingress {
	enabled: boolean;
	annotations: PodAnnotations;
	hosts: Host[];
	tls: any[];
}
interface Host {
	host: string;
	paths: any[];
}
interface ServiceMonitor {
	enabled: boolean;
	labels: PodAnnotations;
	annotations: PodAnnotations;
}
interface Service {
	type: string;
	port: number;
}
interface PodAnnotations {}
interface Image {
	repository: string;
	pullPolicy: string;
	tag: string;
}
