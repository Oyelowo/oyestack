// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../../utilities";

// Export members:
export * from "./consumer";
export * from "./stream";
export * from "./streamTemplate";

// Import resources to register:
import { Consumer } from "./consumer";
import { Stream } from "./stream";
import { StreamTemplate } from "./streamTemplate";

const _module = {
    version: utilities.getVersion(),
    construct: (name: string, type: string, urn: string): pulumi.Resource => {
        switch (type) {
            case "kubernetes:jetstream.nats.io/v1beta1:Consumer":
                return new Consumer(name, <any>undefined, { urn })
            case "kubernetes:jetstream.nats.io/v1beta1:Stream":
                return new Stream(name, <any>undefined, { urn })
            case "kubernetes:jetstream.nats.io/v1beta1:StreamTemplate":
                return new StreamTemplate(name, <any>undefined, { urn })
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule("crds", "jetstream.nats.io/v1beta1", _module)
