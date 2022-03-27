import * as k8s from "@pulumi/kubernetes";

import { provider } from "../shared/cluster";
import { MongodbHelmValuesBitnami } from "../shared/MongodbHelmValuesBitnami";
import { devNamespaceName } from "../shared/namespaces";
import { DeepPartial } from "../shared/types";
import { graphqlMongoSettings } from "./settings";

const { envVars } = graphqlMongoSettings;

/* MONGODB STATEFULSET */
type Credentials = {
  usernames: string[];
  passwords: string[];
  databases: string[];
};
const credentials = [
  {
    username: envVars.MONGODB_USERNAME,
    password: envVars.MONGODB_PASSWORD,
    database: envVars.MONGODB_NAME,
  },
  {
    username: "username1",
    password: "password1",
    database: "database1",
  },
  {
    username: "username2",
    password: "password2",
    database: "database2",
  },
  {
    username: "username3",
    password: "password3",
    database: "database1",
  },
  {
    username: "username4",
    password: "password4",
    database: "database2",
  },
];

const mappedCredentials = credentials.reduce<Credentials>(
  (acc, val) => {
    acc.usernames.push(val.username);
    acc.passwords.push(val.password);
    acc.databases.push(val.database);
    return acc;
  },
  {
    usernames: [],
    passwords: [],
    databases: [],
  }
);

export const mongoValues: DeepPartial<MongodbHelmValuesBitnami> = {
  useStatefulSet: true,
  architecture: "replicaset",
  replicaCount: 3,
  // nameOverride: "mongodb-graphql",
  fullnameOverride: envVars.MONGODB_SERVICE_NAME,
  // global: {
  //   namespaceOverride: devNamespaceName,
  // },

  persistence: {
    size: "0.1Gi", // Default is 8Gi. // TODO: Confirm: This can be increased from initial but not decreased // TODO: Unset this or increase the capacity.
    /* 
    Note
In order to retain your Block Storage Volume and its data, even after the associated PVC is deleted, you must use the linode-block-storage-retain StorageClass. If, instead, you prefer to have your Block Storage Volume and its data deleted along with its PVC, use the linode-block-storage StorageClass. See the Delete a Persistent Volume Claim for steps on deleting a PVC.
    */
    storageClass: "linode-block-storage-retain",
  },

  auth: {
    enabled: true,
    rootUser: "root_user",
    rootPassword: "root_password",
    replicaSetKey: "Ld1My4Q1s4",
    // array of
    ...mappedCredentials,
    // usernames: [graphqlMongoEnvironmentVariables.MONGODB_USERNAME],
    // passwords: [graphqlMongoEnvironmentVariables.MONGODB_PASSWORD],
    // databases: [graphqlMongoEnvironmentVariables.MONGODB_NAME],
    // users: [graphqlMongoEnvironmentVariables.MONGODB_USERNAME],
  },
  service: {
    type: "ClusterIP",
    port: Number(envVars.MONGODB_PORT),
    // portName: "mongo-graphql",
    nameOverride: envVars.MONGODB_SERVICE_NAME,
  },
};

// `http://${name}.${namespace}:${port}`;
export const graphqlMongoMongodb = new k8s.helm.v3.Chart(
  envVars.MONGODB_SERVICE_NAME,
  {
    chart: "mongodb",
    fetchOpts: {
      repo: "https://charts.bitnami.com/bitnami",
    },
    version: "11.0.3",
    values: mongoValues,
    namespace: devNamespaceName,
    // By default Release resource will wait till all created resources
    // are available. Set this to true to skip waiting on resources being
    // available.
    skipAwait: false,
  },
  { provider }
);
