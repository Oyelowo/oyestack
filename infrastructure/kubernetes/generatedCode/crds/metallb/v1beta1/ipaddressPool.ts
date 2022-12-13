// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * IPAddressPool represents a pool of IP addresses that can be allocated to LoadBalancer services.
 */
export class IPAddressPool extends pulumi.CustomResource {
	/**
	 * Get an existing IPAddressPool resource's state with the given name, ID, and optional extra
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
	): IPAddressPool {
		return new IPAddressPool(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:metallb.io/v1beta1:IPAddressPool";

	/**
	 * Returns true if the given object is an instance of IPAddressPool.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is IPAddressPool {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === IPAddressPool.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<"metallb.io/v1beta1" | undefined>;
	public readonly kind!: pulumi.Output<"IPAddressPool" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * IPAddressPoolSpec defines the desired state of IPAddressPool.
	 */
	public readonly spec!: pulumi.Output<outputs.metallb.v1beta1.IPAddressPoolSpec>;
	/**
	 * IPAddressPoolStatus defines the observed state of IPAddressPool.
	 */
	public readonly status!: pulumi.Output<{ [key: string]: any } | undefined>;

	/**
	 * Create a IPAddressPool resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: IPAddressPoolArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "metallb.io/v1beta1";
			resourceInputs["kind"] = "IPAddressPool";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args
				? args.spec
					? pulumi
							.output(args.spec)
							.apply(
								inputs.metallb.v1beta1.ipaddressPoolSpecArgsProvideDefaults,
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
		super(IPAddressPool.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a IPAddressPool resource.
 */
export interface IPAddressPoolArgs {
	apiVersion?: pulumi.Input<"metallb.io/v1beta1">;
	kind?: pulumi.Input<"IPAddressPool">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * IPAddressPoolSpec defines the desired state of IPAddressPool.
	 */
	spec?: pulumi.Input<inputs.metallb.v1beta1.IPAddressPoolSpecArgs>;
	/**
	 * IPAddressPoolStatus defines the observed state of IPAddressPool.
	 */
	status?: pulumi.Input<{ [key: string]: any }>;
}
