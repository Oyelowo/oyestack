// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class Bundle extends pulumi.CustomResource {
	/**
	 * Get an existing Bundle resource's state with the given name, ID, and optional extra
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
	): Bundle {
		return new Bundle(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:trust.cert-manager.io/v1alpha1:Bundle";

	/**
	 * Returns true if the given object is an instance of Bundle.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is Bundle {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === Bundle.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"trust.cert-manager.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"Bundle" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * Desired state of the Bundle resource.
	 */
	public readonly spec!: pulumi.Output<outputs.trust.v1alpha1.BundleSpec>;
	/**
	 * Status of the Bundle. This is set and managed automatically.
	 */
	public readonly status!: pulumi.Output<
		outputs.trust.v1alpha1.BundleStatus | undefined
	>;

	/**
	 * Create a Bundle resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: BundleArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "trust.cert-manager.io/v1alpha1";
			resourceInputs["kind"] = "Bundle";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args ? args.spec : undefined;
			resourceInputs["status"] = args ? args.status : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["spec"] = undefined /*out*/;
			resourceInputs["status"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(Bundle.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a Bundle resource.
 */
export interface BundleArgs {
	apiVersion?: pulumi.Input<"trust.cert-manager.io/v1alpha1">;
	kind?: pulumi.Input<"Bundle">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * Desired state of the Bundle resource.
	 */
	spec?: pulumi.Input<inputs.trust.v1alpha1.BundleSpecArgs>;
	/**
	 * Status of the Bundle. This is set and managed automatically.
	 */
	status?: pulumi.Input<inputs.trust.v1alpha1.BundleStatusArgs>;
}
