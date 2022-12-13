// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class WorkflowTaskResult extends pulumi.CustomResource {
	/**
	 * Get an existing WorkflowTaskResult resource's state with the given name, ID, and optional extra
	 * properties used to qualify the lookup.
	 *
	 * @param name The _unique_ name of the resulting resource.
	 * @param id The _unique_ provider ID of the resource to lookup.
	 * @param opts Optional settings to control the behavior of the CustomResource.
	 */
	public static get(
		name: string,
		id: pulumi.Input<pulumi.ID>,
		opts?: pulumi.CustomResourceOptions,
	): WorkflowTaskResult {
		return new WorkflowTaskResult(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:argoproj.io/v1alpha1:WorkflowTaskResult";

	/**
	 * Returns true if the given object is an instance of WorkflowTaskResult.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is WorkflowTaskResult {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === WorkflowTaskResult.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"argoproj.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"WorkflowTaskResult" | undefined>;
	public readonly message!: pulumi.Output<string | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta>;
	public readonly outputs!: pulumi.Output<
		outputs.argoproj.v1alpha1.WorkflowTaskResultOutputs | undefined
	>;
	public readonly phase!: pulumi.Output<string | undefined>;
	public readonly progress!: pulumi.Output<string | undefined>;

	/**
	 * Create a WorkflowTaskResult resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: WorkflowTaskResultArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "argoproj.io/v1alpha1";
			resourceInputs["kind"] = "WorkflowTaskResult";
			resourceInputs["message"] = args ? args.message : undefined;
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["outputs"] = args ? args.outputs : undefined;
			resourceInputs["phase"] = args ? args.phase : undefined;
			resourceInputs["progress"] = args ? args.progress : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["message"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["outputs"] = undefined /*out*/;
			resourceInputs["phase"] = undefined /*out*/;
			resourceInputs["progress"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(WorkflowTaskResult.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a WorkflowTaskResult resource.
 */
export interface WorkflowTaskResultArgs {
	apiVersion?: pulumi.Input<"argoproj.io/v1alpha1">;
	kind?: pulumi.Input<"WorkflowTaskResult">;
	message?: pulumi.Input<string>;
	metadata?: pulumi.Input<ObjectMeta>;
	outputs?: pulumi.Input<inputs.argoproj.v1alpha1.WorkflowTaskResultOutputsArgs>;
	phase?: pulumi.Input<string>;
	progress?: pulumi.Input<string>;
}
