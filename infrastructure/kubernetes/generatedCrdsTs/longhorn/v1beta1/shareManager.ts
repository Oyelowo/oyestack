// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../../utilities";

import {ObjectMeta} from "../../meta/v1";

/**
 * ShareManager is where Longhorn stores share manager object.
 */
export class ShareManager extends pulumi.CustomResource {
    /**
     * Get an existing ShareManager resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): ShareManager {
        return new ShareManager(name, undefined as any, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'kubernetes:longhorn.io/v1beta1:ShareManager';

    /**
     * Returns true if the given object is an instance of ShareManager.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is ShareManager {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === ShareManager.__pulumiType;
    }

    public readonly apiVersion!: pulumi.Output<"longhorn.io/v1beta1" | undefined>;
    public readonly kind!: pulumi.Output<"ShareManager" | undefined>;
    public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
    public readonly spec!: pulumi.Output<{[key: string]: any} | undefined>;
    public readonly status!: pulumi.Output<{[key: string]: any} | undefined>;

    /**
     * Create a ShareManager resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ShareManagerArgs, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["apiVersion"] = "longhorn.io/v1beta1";
            resourceInputs["kind"] = "ShareManager";
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
        super(ShareManager.__pulumiType, name, resourceInputs, opts);
    }
}

/**
 * The set of arguments for constructing a ShareManager resource.
 */
export interface ShareManagerArgs {
    apiVersion?: pulumi.Input<"longhorn.io/v1beta1">;
    kind?: pulumi.Input<"ShareManager">;
    metadata?: pulumi.Input<ObjectMeta>;
    spec?: pulumi.Input<{[key: string]: any}>;
    status?: pulumi.Input<{[key: string]: any}>;
}
