// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * ThanosRuler defines a ThanosRuler deployment.
 */
export class ThanosRuler extends pulumi.CustomResource {
	/**
	 * Get an existing ThanosRuler resource's state with the given name, ID, and optional extra
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
	): ThanosRuler {
		return new ThanosRuler(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:monitoring.coreos.com/v1:ThanosRuler";

	/**
	 * Returns true if the given object is an instance of ThanosRuler.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is ThanosRuler {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === ThanosRuler.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"monitoring.coreos.com/v1" | undefined
	>;
	public readonly kind!: pulumi.Output<"ThanosRuler" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * Specification of the desired behavior of the ThanosRuler cluster. More info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
	 */
	public readonly spec!: pulumi.Output<outputs.monitoring.v1.ThanosRulerSpec>;
	/**
	 * Most recent observed status of the ThanosRuler cluster. Read-only. Not included when requesting from the apiserver, only from the ThanosRuler Operator API itself. More info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
	 */
	public readonly status!: pulumi.Output<
		outputs.monitoring.v1.ThanosRulerStatus | undefined
	>;

	/**
	 * Create a ThanosRuler resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: ThanosRulerArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "monitoring.coreos.com/v1";
			resourceInputs["kind"] = "ThanosRuler";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args
				? args.spec
					? pulumi
							.output(args.spec)
							.apply(inputs.monitoring.v1.thanosRulerSpecArgsProvideDefaults)
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
		super(ThanosRuler.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a ThanosRuler resource.
 */
export interface ThanosRulerArgs {
	apiVersion?: pulumi.Input<"monitoring.coreos.com/v1">;
	kind?: pulumi.Input<"ThanosRuler">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * Specification of the desired behavior of the ThanosRuler cluster. More info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
	 */
	spec?: pulumi.Input<inputs.monitoring.v1.ThanosRulerSpecArgs>;
	/**
	 * Most recent observed status of the ThanosRuler cluster. Read-only. Not included when requesting from the apiserver, only from the ThanosRuler Operator API itself. More info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
	 */
	status?: pulumi.Input<inputs.monitoring.v1.ThanosRulerStatusArgs>;
}