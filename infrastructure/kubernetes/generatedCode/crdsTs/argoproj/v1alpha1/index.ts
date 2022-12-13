// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../../utilities";

// Export members:
export * from "./analysisRun";
export * from "./analysisTemplate";
export * from "./appProject";
export * from "./application";
export * from "./applicationSet";
export * from "./argoCDExtension";
export * from "./clusterAnalysisTemplate";
export * from "./clusterWorkflowTemplate";
export * from "./cronWorkflow";
export * from "./eventBus";
export * from "./eventSource";
export * from "./experiment";
export * from "./rollout";
export * from "./sensor";
export * from "./workflow";
export * from "./workflowArtifactGCTask";
export * from "./workflowEventBinding";
export * from "./workflowTaskResult";
export * from "./workflowTaskSet";
export * from "./workflowTemplate";

// Import resources to register:
import { AnalysisRun } from "./analysisRun";
import { AnalysisTemplate } from "./analysisTemplate";
import { AppProject } from "./appProject";
import { Application } from "./application";
import { ApplicationSet } from "./applicationSet";
import { ArgoCDExtension } from "./argoCDExtension";
import { ClusterAnalysisTemplate } from "./clusterAnalysisTemplate";
import { ClusterWorkflowTemplate } from "./clusterWorkflowTemplate";
import { CronWorkflow } from "./cronWorkflow";
import { EventBus } from "./eventBus";
import { EventSource } from "./eventSource";
import { Experiment } from "./experiment";
import { Rollout } from "./rollout";
import { Sensor } from "./sensor";
import { Workflow } from "./workflow";
import { WorkflowArtifactGCTask } from "./workflowArtifactGCTask";
import { WorkflowEventBinding } from "./workflowEventBinding";
import { WorkflowTaskResult } from "./workflowTaskResult";
import { WorkflowTaskSet } from "./workflowTaskSet";
import { WorkflowTemplate } from "./workflowTemplate";

const _module = {
	version: utilities.getVersion(),
	construct: (name: string, type: string, urn: string): pulumi.Resource => {
		switch (type) {
			case "kubernetes:argoproj.io/v1alpha1:AnalysisRun":
				return new AnalysisRun(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:AnalysisTemplate":
				return new AnalysisTemplate(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:AppProject":
				return new AppProject(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:Application":
				return new Application(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:ApplicationSet":
				return new ApplicationSet(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:ArgoCDExtension":
				return new ArgoCDExtension(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:ClusterAnalysisTemplate":
				return new ClusterAnalysisTemplate(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:ClusterWorkflowTemplate":
				return new ClusterWorkflowTemplate(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:CronWorkflow":
				return new CronWorkflow(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:EventBus":
				return new EventBus(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:EventSource":
				return new EventSource(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:Experiment":
				return new Experiment(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:Rollout":
				return new Rollout(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:Sensor":
				return new Sensor(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:Workflow":
				return new Workflow(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:WorkflowArtifactGCTask":
				return new WorkflowArtifactGCTask(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:WorkflowEventBinding":
				return new WorkflowEventBinding(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:WorkflowTaskResult":
				return new WorkflowTaskResult(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:WorkflowTaskSet":
				return new WorkflowTaskSet(name, <any>undefined, { urn });
			case "kubernetes:argoproj.io/v1alpha1:WorkflowTemplate":
				return new WorkflowTemplate(name, <any>undefined, { urn });
			default:
				throw new Error(`unknown resource type ${type}`);
		}
	},
};
pulumi.runtime.registerResourceModule("crds", "argoproj.io/v1alpha1", _module);
