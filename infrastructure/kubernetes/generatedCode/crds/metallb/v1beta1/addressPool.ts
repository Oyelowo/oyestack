// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * AddressPool represents a pool of IP addresses that can be allocated to LoadBalancer services. AddressPool is deprecated and being replaced by IPAddressPool.
 */
export class AddressPool extends pulumi.CustomResource {
	/**
	 * Get an existing AddressPool resource's state with the given name, ID, and optional extra
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
	): AddressPool {
		return new AddressPool(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:metallb.io/v1beta1:AddressPool";

	/**
	 * Returns true if the given object is an instance of AddressPool.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is AddressPool {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === AddressPool.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<"metallb.io/v1beta1" | undefined>;
	public readonly kind!: pulumi.Output<"AddressPool" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * AddressPoolSpec defines the desired state of AddressPool.
	 */
	public readonly spec!: pulumi.Output<outputs.metallb.v1beta1.AddressPoolSpec>;
	/**
	 * AddressPoolStatus defines the observed state of AddressPool.
	 */
	public readonly status!: pulumi.Output<{ [key: string]: any } | undefined>;

	/**
	 * Create a AddressPool resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: AddressPoolArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "metallb.io/v1beta1";
			resourceInputs["kind"] = "AddressPool";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args
				? args.spec
					? pulumi
							.output(args.spec)
							.apply(inputs.metallb.v1beta1.addressPoolSpecArgsProvideDefaults)
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
		super(AddressPool.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a AddressPool resource.
 */
export interface AddressPoolArgs {
	apiVersion?: pulumi.Input<"metallb.io/v1beta1">;
	kind?: pulumi.Input<"AddressPool">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * AddressPoolSpec defines the desired state of AddressPool.
	 */
	spec?: pulumi.Input<inputs.metallb.v1beta1.AddressPoolSpecArgs>;
	/**
	 * AddressPoolStatus defines the observed state of AddressPool.
	 */
	status?: pulumi.Input<{ [key: string]: any }>;
}
