import { AppConfigs, CommonEnvVariables } from '../../types/ownTypes.js';
import { getIngressUrl } from '../../infrastructure/ingress/hosts.js';
import { getEnvVarsForKubeManifests, imageTags } from '../../shared/environmentVariablesForManifests.js';
import { PlainSecretsManager } from '../../../scripts/utils/plainSecretsManager.js';

const env = getEnvVarsForKubeManifests();
const secrets = new PlainSecretsManager('services', 'graphql-postgres', env.ENVIRONMENT).getSecrets();

export type GraphqlPostgresEnvVars = CommonEnvVariables<'graphql-postgres', 'applications'>[
    | 'app'
    | 'oauth'
    | 'postgresdb'
    | 'redis'];

export const graphqlPostgresSettings: AppConfigs<'graphql-postgres', 'applications', GraphqlPostgresEnvVars> = {
    kubeConfig: {
        requestMemory: '70Mi',
        requestCpu: '100m',
        limitMemory: '200Mi',
        limitCpu: '100m',
        replicaCount: 3,
        host: '0.0.0.0',
        readinessProbePort: 8000,
        image: `ghcr.io/oyelowo/graphql-postgres:${imageTags.SERVICES__GRAPHQL_POSTGRES__IMAGE_TAG}`,
    },

    envVars: {
        APP_ENVIRONMENT: env.ENVIRONMENT,
        APP_HOST: '0.0.0.0',
        APP_PORT: '8000',
        APP_EXTERNAL_BASE_URL: getIngressUrl({ environment: env.ENVIRONMENT }),
        POSTGRES_DATABASE_NAME: 'graphql-postgres-database',
        POSTGRES_NAME: 'graphql-postgres-database',
        POSTGRES_USERNAME: secrets.POSTGRES_USERNAME,
        POSTGRES_PASSWORD: secrets.POSTGRES_PASSWORD,
        POSTGRES_HOST: 'graphql-postgres-database.applications', // the name of the postgres service being connected to. The name has suffices(primary|read etc) if using replcated architecture
        POSTGRES_PORT: '5432',
        POSTGRES_SERVICE_NAME: 'graphql-postgres-database',
        POSTGRES_STORAGE_CLASS: 'linode-block-storage-retain',
    },
    metadata: {
        name: 'graphql-postgres',
        namespace: 'applications',
    },
};
