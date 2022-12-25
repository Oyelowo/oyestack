// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * HTTPRoute provides a way to route HTTP requests. This includes the capability to match requests by hostname, path, header, or query param. Filters can be used to specify additional processing steps. Backends specify where matching requests should be routed.
 */
export class HTTPRoute extends pulumi.CustomResource {
	/**
	 * Get an existing HTTPRoute resource's state with the given name, ID, and optional extra
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
	): HTTPRoute {
		return new HTTPRoute(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:policy.linkerd.io/v1alpha1:HTTPRoute";

	/**
	 * Returns true if the given object is an instance of HTTPRoute.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is HTTPRoute {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === HTTPRoute.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<
		"policy.linkerd.io/v1alpha1" | undefined
	>;
	public readonly kind!: pulumi.Output<"HTTPRoute" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * Spec defines the desired state of HTTPRoute.
	 */
	public readonly spec!: pulumi.Output<outputs.policy.v1alpha1.HTTPRouteSpec>;
	/**
	 * Status defines the current state of HTTPRoute.
	 */
	public readonly status!: pulumi.Output<
		outputs.policy.v1alpha1.HTTPRouteStatus | undefined
	>;

	/**
	 * Create a HTTPRoute resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: HTTPRouteArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "policy.linkerd.io/v1alpha1";
			resourceInputs["kind"] = "HTTPRoute";
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
		super(HTTPRoute.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a HTTPRoute resource.
 */
export interface HTTPRouteArgs {
	apiVersion?: pulumi.Input<"policy.linkerd.io/v1alpha1">;
	kind?: pulumi.Input<"HTTPRoute">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * Spec defines the desired state of HTTPRoute.
	 */
	spec?: pulumi.Input<inputs.policy.v1alpha1.HTTPRouteSpecArgs>;
	/**
	 * Status defines the current state of HTTPRoute.
	 */
	status?: pulumi.Input<inputs.policy.v1alpha1.HTTPRouteStatusArgs>;
}