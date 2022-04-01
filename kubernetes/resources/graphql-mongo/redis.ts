import { graphqlMongoSettings } from "./settings";
import { environmentVariables } from "./../shared/validations";
import { RedisHelmValuesBitnami } from "./../shared/types/helm-charts/redisHelmValuesBitnami";
import * as k8s from "@pulumi/kubernetes";

import { applicationsDirectory } from "../shared/manifestsDirectory";
import { namespaceNames } from "../shared/namespaces";
import { DeepPartial } from "../shared/types/own-types";

const { envVars } = graphqlMongoSettings;

export const redisValues: DeepPartial<RedisHelmValuesBitnami> = {
  //   architecture: "replication",
  architecture: "standalone",

  // nameOverride: "redis-graphql",
  fullnameOverride: envVars.REDIS_SERVICE_NAME,
  replica: {
    replicaCount: 1,
  },
  global: {
    // namespaceOverride: devNamespaceName,
    storageClass:
      environmentVariables.ENVIRONMENT === "local"
        ? ""
        : graphqlMongoSettings.envVars.MONGODB_STORAGE_CLASS,
  },

  auth: {
    enabled: true,
    password: envVars.REDIS_PASSWORD,
  },
  master: {
    service: {
      type: "ClusterIP",
      ports: {
        redis: 6379,
        //    Number(envVars.REDIS_PORT),
        // nameOverride: envVars.REDIS_SERVICE_NAME,
      },
      // portName: "mongo-graphql",
    },
  },
};

// `http://${name}.${namespace}:${port}`;
export const graphqlMongoRedis = new k8s.helm.v3.Chart(
  "redis",
  {
    chart: "redis",
    fetchOpts: {
      repo: "https://charts.bitnami.com/bitnami",
    },
    version: "16.4.5",
    values: redisValues,
    namespace: namespaceNames.applications,
    // By default Release resource will wait till all created resources
    // are available. Set this to true to skip waiting on resources being
    // available.
    skipAwait: false,
  },
  { provider: applicationsDirectory }
);
