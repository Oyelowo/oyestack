// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

export class MeshTLSAuthentication extends pulumi.CustomResource {
	/**
	 * Get an existing MeshTLSAuthentication resource's state with the given name, ID, and optional extra
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
	): MeshTLSAuthentication {
		return new MeshTLSAuthentication(name, undefined as any, {
			...opts,
			id: id,
		});
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:policy.linkerd.io/v1alpha1:MeshTLSAuthentication";

	/**
	 * Returns true if the given object is an instance of MeshTLSAuthentication.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is MeshTLSAuthentication {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === MeshTLSAuthentication.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"policy.linkerd.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"MeshTLSAuthentication" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * MeshTLSAuthentication defines a list of authenticated client IDs to be referenced by an `AuthorizationPolicy`. If a client connection has the mutually-authenticated identity that matches ANY of the of the provided identities, the connection is considered authenticated.
	 */
	public readonly spec!: pulumi.Output<any>;

	/**
	 * Create a MeshTLSAuthentication resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: MeshTLSAuthenticationArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "policy.linkerd.io/v1alpha1";
			resourceInputs["kind"] = "MeshTLSAuthentication";
			resourceInputs["metadata"] = args ? args.metadata : undefined;
			resourceInputs["spec"] = args ? args.spec : undefined;
		} else {
			resourceInputs["apiVersion"] = undefined /*out*/;
			resourceInputs["kind"] = undefined /*out*/;
			resourceInputs["metadata"] = undefined /*out*/;
			resourceInputs["spec"] = undefined /*out*/;
		}
		opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
		super(MeshTLSAuthentication.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a MeshTLSAuthentication resource.
 */
export interface MeshTLSAuthenticationArgs {
	apiVersion?: pulumi.Input<"policy.linkerd.io/v1alpha1">;
	kind?: pulumi.Input<"MeshTLSAuthentication">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * MeshTLSAuthentication defines a list of authenticated client IDs to be referenced by an `AuthorizationPolicy`. If a client connection has the mutually-authenticated identity that matches ANY of the of the provided identities, the connection is considered authenticated.
	 */
	spec?: any;
}
