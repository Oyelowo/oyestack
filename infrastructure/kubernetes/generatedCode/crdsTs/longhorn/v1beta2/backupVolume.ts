// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import { ObjectMeta } from "../../meta/v1";

/**
 * BackupVolume is where Longhorn stores backup volume object.
 */
export class BackupVolume extends pulumi.CustomResource {
	/**
	 * Get an existing BackupVolume resource's state with the given name, ID, and optional extra
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
	): BackupVolume {
		return new BackupVolume(name, undefined as any, { ...opts, id: id });
	}

	/** @internal */
	public static readonly __pulumiType =
		"kubernetes:longhorn.io/v1beta2:BackupVolume";

	/**
	 * Returns true if the given object is an instance of BackupVolume.  This is designed to work even
	 * when multiple copies of the Pulumi SDK have been loaded into the same process.
	 */
	public static isInstance(obj: any): obj is BackupVolume {
		if (obj === undefined || obj === null) {
			return false;
		}
		return obj["__pulumiType"] === BackupVolume.__pulumiType;
	}

	public readonly apiVersion!: pulumi.Output<"longhorn.io/v1beta2" | undefined>;
	public readonly kind!: pulumi.Output<"BackupVolume" | undefined>;
	public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
	/**
	 * BackupVolumeSpec defines the desired state of the Longhorn backup volume
	 */
	public readonly spec!: pulumi.Output<
		outputs.longhorn.v1beta2.BackupVolumeSpec | undefined
	>;
	/**
	 * BackupVolumeStatus defines the observed state of the Longhorn backup volume
	 */
	public readonly status!: pulumi.Output<
		outputs.longhorn.v1beta2.BackupVolumeStatus | undefined
	>;

	/**
	 * Create a BackupVolume resource with the given unique name, arguments, and options.
	 *
	 * @param name The _unique_ name of the resource.
	 * @param args The arguments to use to populate this resource's properties.
	 * @param opts A bag of options that control this resource's behavior.
	 */
	constructor(
		name: string,
		args?: BackupVolumeArgs,
		opts?: pulumi.CustomResourceOptions,
	) {
		let resourceInputs: pulumi.Inputs = {};
		opts = opts || {};
		if (!opts.id) {
			resourceInputs["apiVersion"] = "longhorn.io/v1beta2";
			resourceInputs["kind"] = "BackupVolume";
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
		super(BackupVolume.__pulumiType, name, resourceInputs, opts);
	}
}

/**
 * The set of arguments for constructing a BackupVolume resource.
 */
export interface BackupVolumeArgs {
	apiVersion?: pulumi.Input<"longhorn.io/v1beta2">;
	kind?: pulumi.Input<"BackupVolume">;
	metadata?: pulumi.Input<ObjectMeta>;
	/**
	 * BackupVolumeSpec defines the desired state of the Longhorn backup volume
	 */
	spec?: pulumi.Input<inputs.longhorn.v1beta2.BackupVolumeSpecArgs>;
	/**
	 * BackupVolumeStatus defines the observed state of the Longhorn backup volume
	 */
	status?: pulumi.Input<inputs.longhorn.v1beta2.BackupVolumeStatusArgs>;
}
