// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import {ObjectMeta} from "../../meta/v1";

/**
 * CephCluster is a Ceph storage cluster
 */
export class CephCluster extends pulumi.CustomResource {
    /**
     * Get an existing CephCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): CephCluster {
        return new CephCluster(name, undefined as any, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'kubernetes:ceph.rook.io/v1:CephCluster';

    /**
     * Returns true if the given object is an instance of CephCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is CephCluster {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === CephCluster.__pulumiType;
    }

    public readonly apiVersion!: pulumi.Output<"ceph.rook.io/v1" | undefined>;
    public readonly kind!: pulumi.Output<"CephCluster" | undefined>;
    public readonly metadata!: pulumi.Output<ObjectMeta>;
    /**
     * ClusterSpec represents the specification of Ceph Cluster
     */
    public readonly spec!: pulumi.Output<outputs.ceph.v1.CephClusterSpec>;
    /**
     * ClusterStatus represents the status of a Ceph cluster
     */
    public readonly status!: pulumi.Output<{[key: string]: any} | undefined>;

    /**
     * Create a CephCluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CephClusterArgs, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["apiVersion"] = "ceph.rook.io/v1";
            resourceInputs["kind"] = "CephCluster";
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
        super(CephCluster.__pulumiType, name, resourceInputs, opts);
    }
}

/**
 * The set of arguments for constructing a CephCluster resource.
 */
export interface CephClusterArgs {
    apiVersion?: pulumi.Input<"ceph.rook.io/v1">;
    kind?: pulumi.Input<"CephCluster">;
    metadata?: pulumi.Input<ObjectMeta>;
    /**
     * ClusterSpec represents the specification of Ceph Cluster
     */
    spec?: pulumi.Input<inputs.ceph.v1.CephClusterSpecArgs>;
    /**
     * ClusterStatus represents the status of a Ceph cluster
     */
    status?: pulumi.Input<{[key: string]: any}>;
}
