// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from '@pulumi/pulumi';
import { input as inputs, output as outputs } from '../../types';
import * as utilities from '../../utilities';

import { ObjectMeta } from '../../meta/v1';

export class ServiceProfile extends pulumi.CustomResource {
    /**
     * Get an existing ServiceProfile resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): ServiceProfile {
        return new ServiceProfile(name, undefined as any, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'kubernetes:linkerd.io/v1alpha2:ServiceProfile';

    /**
     * Returns true if the given object is an instance of ServiceProfile.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is ServiceProfile {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === ServiceProfile.__pulumiType;
    }

    public readonly apiVersion!: pulumi.Output<'linkerd.io/v1alpha2' | undefined>;
    public readonly kind!: pulumi.Output<'ServiceProfile' | undefined>;
    public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
    /**
     * Spec is the custom resource spec
     */
    public readonly spec!: pulumi.Output<outputs.linkerd.v1alpha2.ServiceProfileSpec | undefined>;

    /**
     * Create a ServiceProfile resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ServiceProfileArgs, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs['apiVersion'] = 'linkerd.io/v1alpha2';
            resourceInputs['kind'] = 'ServiceProfile';
            resourceInputs['metadata'] = args ? args.metadata : undefined;
            resourceInputs['spec'] = args ? args.spec : undefined;
        } else {
            resourceInputs['apiVersion'] = undefined /*out*/;
            resourceInputs['kind'] = undefined /*out*/;
            resourceInputs['metadata'] = undefined /*out*/;
            resourceInputs['spec'] = undefined /*out*/;
        }
        if (!opts.version) {
            opts = pulumi.mergeOptions(opts, { version: utilities.getVersion() });
        }
        super(ServiceProfile.__pulumiType, name, resourceInputs, opts);
    }
}

/**
 * The set of arguments for constructing a ServiceProfile resource.
 */
export interface ServiceProfileArgs {
    apiVersion?: pulumi.Input<'linkerd.io/v1alpha2'>;
    kind?: pulumi.Input<'ServiceProfile'>;
    metadata?: pulumi.Input<ObjectMeta>;
    /**
     * Spec is the custom resource spec
     */
    spec?: pulumi.Input<inputs.linkerd.v1alpha2.ServiceProfileSpecArgs>;
}
