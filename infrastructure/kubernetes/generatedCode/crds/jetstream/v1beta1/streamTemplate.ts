// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class StreamTemplate extends pulumi.CustomResource {
	/**
	 * Get an existing StreamTemplate resource's state with the given name, ID, and optional extra
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
	): StreamTemplate {
		return new StreamTemplate(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:jetstream.nats.io/v1beta1:StreamTemplate";

	/**
	 * Returns true if the given object is an instance of StreamTemplate.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is StreamTemplate {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === StreamTemplate.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"jetstream.nats.io/v1beta1" | undefined
	>;
	public readonly kind!: pulumi.Output<"StreamTemplate" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	public readonly spec!: pulumi.Output<
		outputs.jetstream.v1beta1.StreamTemplateSpec | undefined
	>;
	public readonly status!: pulumi.Output<
		outputs.jetstream.v1beta1.StreamTemplateStatus | undefined
	>;

	/**
	 * Create a StreamTemplate resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: StreamTemplateArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "jetstream.nats.io/v1beta1";
			resourceInputs["kind"] = "StreamTemplate";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args
				? args.spec
					? pulumi
							.output(args.spec)
							.apply(
								inputs.jetstream.v1beta1.streamTemplateSpecArgsProvideDefaults,
							)
					: undefined
				: undefined;
			resourceInputs["status"] = args ? args.status : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["spec"] = undefined /*out*/;
			resourceInputs["status"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(StreamTemplate.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a StreamTemplate resource.
 */
export interface StreamTemplateArgs {
	apiVersion?: pulumi.Input<"jetstream.nats.io/v1beta1">;
	kind?: pulumi.Input<"StreamTemplate">;
	metadata?: pulumi.Input<ObjectMeta>;
	spec?: pulumi.Input<inputs.jetstream.v1beta1.StreamTemplateSpecArgs>;
	status?: pulumi.Input<inputs.jetstream.v1beta1.StreamTemplateStatusArgs>;
}
