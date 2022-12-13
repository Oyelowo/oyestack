// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class AnalysisTemplate extends pulumi.CustomResource {
	/**
	 * Get an existing AnalysisTemplate resource's state with the given name, ID, and optional extra
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
	): AnalysisTemplate {
		return new AnalysisTemplate(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:argoproj.io/v1alpha1:AnalysisTemplate";

	/**
	 * Returns true if the given object is an instance of AnalysisTemplate.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is AnalysisTemplate {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === AnalysisTemplate.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"argoproj.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"AnalysisTemplate" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	public readonly spec!: pulumi.Output<outputs.argoproj.v1alpha1.AnalysisTemplateSpec>;

	/**
	 * Create a AnalysisTemplate resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: AnalysisTemplateArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "argoproj.io/v1alpha1";
			resourceInputs["kind"] = "AnalysisTemplate";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args ? args.spec : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["spec"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(AnalysisTemplate.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a AnalysisTemplate resource.
 */
export interface AnalysisTemplateArgs {
	apiVersion?: pulumi.Input<"argoproj.io/v1alpha1">;
	kind?: pulumi.Input<"AnalysisTemplate">;
	metadata?: pulumi.Input<ObjectMeta>;
	spec?: pulumi.Input<inputs.argoproj.v1alpha1.AnalysisTemplateSpecArgs>;
}
