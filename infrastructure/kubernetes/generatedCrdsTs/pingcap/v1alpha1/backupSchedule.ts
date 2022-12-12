// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import {ObjectMeta} from "../../meta/v1";

export class BackupSchedule extends pulumi.CustomResource {
    /**
     * Get an existing BackupSchedule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): BackupSchedule {
        return new BackupSchedule(name, undefined as any, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'kubernetes:pingcap.com/v1alpha1:BackupSchedule';

    /**
     * Returns true if the given object is an instance of BackupSchedule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is BackupSchedule {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === BackupSchedule.__pulumiType;
    }

    public readonly apiVersion!: pulumi.Output<"pingcap.com/v1alpha1" | undefined>;
    public readonly kind!: pulumi.Output<"BackupSchedule" | undefined>;
    public readonly metadata!: pulumi.Output<ObjectMeta>;
    public readonly spec!: pulumi.Output<outputs.pingcap.v1alpha1.BackupScheduleSpec>;
    public readonly status!: pulumi.Output<outputs.pingcap.v1alpha1.BackupScheduleStatus | undefined>;

    /**
     * Create a BackupSchedule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: BackupScheduleArgs, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["apiVersion"] = "pingcap.com/v1alpha1";
            resourceInputs["kind"] = "BackupSchedule";
            resourceInputs["metadata"] = args ? args.metadata : undefined;
            resourceInputs["spec"] = args ? (args.spec ? pulumi.output(args.spec).apply(inputs.pingcap.v1alpha1.backupScheduleSpecArgsProvideDefaults) : undefined) : undefined;
            resourceInputs["status"] = args ? args.status : undefined;
        } else {
            resourceInputs["apiVersion"] = undefined /*out*/;
            resourceInputs["kind"] = undefined /*out*/;
            resourceInputs["metadata"] = undefined /*out*/;
            resourceInputs["spec"] = undefined /*out*/;
            resourceInputs["status"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(BackupSchedule.__pulumiType, name, resourceInputs, opts);
    }
}

/**
 * The set of arguments for constructing a BackupSchedule resource.
 */
export interface BackupScheduleArgs {
    apiVersion?: pulumi.Input<"pingcap.com/v1alpha1">;
    kind?: pulumi.Input<"BackupSchedule">;
    metadata?: pulumi.Input<ObjectMeta>;
    spec?: pulumi.Input<inputs.pingcap.v1alpha1.BackupScheduleSpecArgs>;
    status?: pulumi.Input<inputs.pingcap.v1alpha1.BackupScheduleStatusArgs>;
}