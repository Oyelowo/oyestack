import { GraphQLClient } from "graphql-request";
// import { hosts } from "../../../../kubernetes/resources/infrastructure/ingress/hosts"

// Get this from infra kubernetes and also dynamically assign it depending on the environment
export const DOMAIN_BASE = "http://localhost:8080/api";

export const client = new GraphQLClient(`${DOMAIN_BASE}/graphql`, {
  credentials: "include",
  headers: {},
});
