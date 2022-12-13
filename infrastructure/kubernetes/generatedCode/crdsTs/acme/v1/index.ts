// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../../utilities";

// Export members:
export * from "./challenge";
export * from "./order";

// Import resources to register:
import { Challenge } from "./challenge";
import { Order } from "./order";

const _module = {
	version: utilities.getVersion(),
	construct: (name: string, type: string, urn: string): pulumi.Resource => {
		switch (type) {
			case "kubernetes:acme.cert-manager.io/v1:Challenge":
				return new Challenge(name, <any>undefined, { urn });
			case "kubernetes:acme.cert-manager.io/v1:Order":
				return new Order(name, <any>undefined, { urn });
			default:
				throw new Error(`unknown resource type ${type}`);
		}
	},
};
pulumi.runtime.registerResourceModule(
	"crds",
	"acme.cert-manager.io/v1",
	_module,
);
