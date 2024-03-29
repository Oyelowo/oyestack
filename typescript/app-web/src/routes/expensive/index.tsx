import { createRouteConfig, lazy } from "@tanstack/react-router";
import { loaderDelayFn } from "../../utils.js";

export const expensiveRoute = createRouteConfig().createRoute({
	// Your elements can be asynchronous, which means you can code-split!
	path: "expensive",
	component: lazy(() => loaderDelayFn(() => import("./Expensive.js"))),
});
