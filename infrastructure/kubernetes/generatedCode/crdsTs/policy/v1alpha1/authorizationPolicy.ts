// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class AuthorizationPolicy extends pulumi.CustomResource {
	/**
	 * Get an existing AuthorizationPolicy resource's state with the given name, ID, and optional extra
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
	): AuthorizationPolicy {
		return new AuthorizationPolicy(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:policy.linkerd.io/v1alpha1:AuthorizationPolicy";

	/**
	 * Returns true if the given object is an instance of AuthorizationPolicy.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is AuthorizationPolicy {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === AuthorizationPolicy.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"policy.linkerd.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"AuthorizationPolicy" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * Authorizes clients to communicate with Linkerd-proxied server resources.
	 */
	public readonly spec!: pulumi.Output<outputs.policy.v1alpha1.AuthorizationPolicySpec>;

	/**
	 * Create a AuthorizationPolicy resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: AuthorizationPolicyArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "policy.linkerd.io/v1alpha1";
			resourceInputs["kind"] = "AuthorizationPolicy";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args ? args.spec : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["spec"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(AuthorizationPolicy.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a AuthorizationPolicy resource.
 */
export interface AuthorizationPolicyArgs {
	apiVersion?: pulumi.Input<"policy.linkerd.io/v1alpha1">;
	kind?: pulumi.Input<"AuthorizationPolicy">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * Authorizes clients to communicate with Linkerd-proxied server resources.
	 */
	spec?: pulumi.Input<inputs.policy.v1alpha1.AuthorizationPolicySpecArgs>;
}
