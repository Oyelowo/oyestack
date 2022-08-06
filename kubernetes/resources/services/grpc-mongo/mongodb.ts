import { IMongodbbitnami } from './../../types/helm-charts/mongodbBitnami.js';
import { grpcMongo } from './app.js';
import { namespaces } from '../../infrastructure/namespaces/util.js';
import * as k8s from '@pulumi/kubernetes';

import { grpcMongoSettings } from './settings.js';
import { DeepPartial } from '../../types/ownTypes.js';
import { getEnvironmentVariables } from '../../shared/validations.js';
import { helmChartsInfo } from '../../shared/helmChartInfo.js';

const environmentVariables = getEnvironmentVariables();

/* MONGODB STATEFULSET */
type Credentials = {
    usernames: string[];
    passwords: string[];
    databases: string[];
};
const credentials = [
    {
        username: grpcMongoSettings.envVars.MONGODB_USERNAME,
        password: grpcMongoSettings.envVars.MONGODB_PASSWORD,
        database: grpcMongoSettings.envVars.MONGODB_NAME,
    },
    {
        username: 'username1',
        password: 'password1',
        database: 'database1',
    },
    {
        username: 'username2',
        password: 'password2',
        database: 'database2',
    },
    {
        username: 'username3',
        password: 'password3',
        database: 'database1',
    },
    {
        username: 'username4',
        password: 'password4',
        database: 'database2',
    },
];

const mappedCredentials: Credentials = {
    usernames: [],
    passwords: [],
    databases: [],
};

for (const val of credentials) {
    mappedCredentials.usernames.push(val.username);
    mappedCredentials.passwords.push(val.password);
    mappedCredentials.databases.push(val.database);
}

const mongoValues: DeepPartial<IMongodbbitnami> = {
    useStatefulSet: true,
    architecture: 'replicaset',
    replicaCount: 3,
    fullnameOverride: grpcMongoSettings.envVars.MONGODB_SERVICE_NAME,
    global: {
        storageClass:
            environmentVariables.ENVIRONMENT === 'local' ? '' : grpcMongoSettings.envVars.MONGODB_STORAGE_CLASS,
    },
    auth: {
        enabled: true,
        rootUser: 'root_user',
        rootPassword: 'root_password',
        // replicaSetKey: 'Ld1My4Q1s4',
        ...mappedCredentials,
    },
    service: {
        type: 'ClusterIP',
        port: Number(grpcMongoSettings.envVars.MONGODB_PORT),
        nameOverride: grpcMongoSettings.envVars.MONGODB_SERVICE_NAME,
    },
};

const {
    repo,
    charts: {
        mongodb: { chart, version },
    },
} = helmChartsInfo.bitnami;

// `http://${name}.${namespace}:${port}`;
export const grpcMongoMongodb = new k8s.helm.v3.Chart(
    chart,
    {
        chart,
        fetchOpts: {
            repo,
        },
        version,
        values: mongoValues,
        namespace: namespaces.applications,
        // By default Release resource will wait till all created resources
        // are available. Set this to true to skip waiting on resources being
        // available.
        skipAwait: false,
    },
    { provider: grpcMongo.getProvider() }
);
