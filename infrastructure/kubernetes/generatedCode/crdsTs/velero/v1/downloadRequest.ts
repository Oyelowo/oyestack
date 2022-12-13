// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * DownloadRequest is a request to download an artifact from backup object storage, such as a backup log file.
 */
export class DownloadRequest extends pulumi.CustomResource {
	/**
	 * Get an existing DownloadRequest resource's state with the given name, ID, and optional extra
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
	): DownloadRequest {
		return new DownloadRequest(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:velero.io/v1:DownloadRequest";

	/**
	 * Returns true if the given object is an instance of DownloadRequest.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is DownloadRequest {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === DownloadRequest.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<"velero.io/v1" | undefined>;
	public readonly kind!: pulumi.Output<"DownloadRequest" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * DownloadRequestSpec is the specification for a download request.
	 */
	public readonly spec!: pulumi.Output<
		outputs.velero.v1.DownloadRequestSpec | undefined
	>;
	/**
	 * DownloadRequestStatus is the current status of a DownloadRequest.
	 */
	public readonly status!: pulumi.Output<
		outputs.velero.v1.DownloadRequestStatus | undefined
	>;

	/**
	 * Create a DownloadRequest resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: DownloadRequestArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "velero.io/v1";
			resourceInputs["kind"] = "DownloadRequest";
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
		super(DownloadRequest.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a DownloadRequest resource.
 */
export interface DownloadRequestArgs {
	apiVersion?: pulumi.Input<"velero.io/v1">;
	kind?: pulumi.Input<"DownloadRequest">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * DownloadRequestSpec is the specification for a download request.
	 */
	spec?: pulumi.Input<inputs.velero.v1.DownloadRequestSpecArgs>;
	/**
	 * DownloadRequestStatus is the current status of a DownloadRequest.
	 */
	status?: pulumi.Input<inputs.velero.v1.DownloadRequestStatusArgs>;
}
