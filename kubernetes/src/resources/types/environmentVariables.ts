import * as dotenv from 'dotenv';

import {
    appEnvironmentsSchema,
    Environment,
    EnvVarsCommon,
    InfrastructureName,
    ResourceCategory,
    ServiceName,
    TServices,
} from './ownTypes.js';
import { Simplify, SnakeCase } from 'type-fest';
import z from 'zod';
import _ from 'lodash';

// This is provided fro, within the CI pipeline where the manifests are generated and pushed to the repo
//     IMAGE_TAG_REACT_WEB: string;
// IMAGE_TAG_GRAPHQL_MONGO: string;
// IMAGE_TAG_GRPC_MONGO: string;
// IMAGE_TAG_GRAPHQL_POSTGRES: string;
type GraphqlMongo = EnvVarsCommon<'graphql-mongo', 'applications', 'app' | 'mongodb' | 'oauth' | 'redis'>;

type GraphqlPostgres = EnvVarsCommon<'graphql-postgres', 'applications', 'app' | 'postgresdb'>;

type GrpcMongo = EnvVarsCommon<'grpc-mongo', 'applications', 'app' | 'mongodb'>;

type ReactWeb = EnvVarsCommon<'grpc-mongo', 'applications', 'app'>;

type RecordServiceEnvVars<N extends ServiceName, EnvVars> = Record<N, EnvVars>;
type RecordInfraEnvVars<N extends InfrastructureName, EnvVars> = Record<N, EnvVars>;

type ArgoCd = {
    ADMIN_PASSWORD: string;
    type: 'git';
    url: 'https://github.com/Oyelowo/modern-distributed-app-template';
    username: string;
    password: string;
};

type LinkerdViz = {
    PASSWORD: string;
};

// Creates Record<ResourceName, Record<EnvVarName, string>>
type ServicesEnvVars = Simplify<
    RecordServiceEnvVars<'graphql-mongo', GraphqlMongo> &
    RecordServiceEnvVars<'graphql-postgres', GraphqlPostgres> &
    RecordServiceEnvVars<'grpc-mongo', GrpcMongo> &
    RecordServiceEnvVars<'react-web', ReactWeb>
>;
type InfrastructureEnvVars = Simplify<
    RecordInfraEnvVars<'argocd', ArgoCd> & RecordInfraEnvVars<'linkerd-viz', LinkerdViz>
>;

type EnvVarsByCategory<RCat extends ResourceCategory, V> = Record<RCat, V>;

export type EnvVarsByResourceCategory = EnvVarsByCategory<'infrastructure', InfrastructureEnvVars> &
    EnvVarsByCategory<'services', ServicesEnvVars>;

type Stringified<T> = Extract<T, string>;
type PrefixEnvVar<RCat extends ResourceCategory, RName, EnvVarName extends string> = Uppercase<`${RCat}__${SnakeCase<
    Stringified<RName>
>}__${EnvVarName}`>;

/** Generates the format in all caps:  \<ResourceCategory>\__\<ResourceName>\__\<EnvironmentVariableNaame>
 * @example SERVICES__GRAPHQL_MONGO__REDIS_PASSWORD */
type CreateEnvCarsCreator<
    RCat extends ResourceCategory,
    ResourceCategoryEnvVar,
    RName extends keyof ResourceCategoryEnvVar,
    EnvVarNames extends keyof ResourceCategoryEnvVar[RName]
    > = Record<PrefixEnvVar<RCat, RName, keyof Pick<ResourceCategoryEnvVar[RName], Stringified<EnvVarNames>>>, string>;

type SelectFromServicesEnvVars<
    RName extends keyof ServicesEnvVars,
    EnvVarNames extends keyof ServicesEnvVars[RName]
    > = CreateEnvCarsCreator<'services', ServicesEnvVars, RName, EnvVarNames>;

type SelectFromInfraEnvVars<
    RName extends keyof InfrastructureEnvVars,
    EnvVarNames extends keyof InfrastructureEnvVars[RName]
    > = CreateEnvCarsCreator<'infrastructure', InfrastructureEnvVars, RName, EnvVarNames>;


const imageTagsSchema: Record<PrefixEnvVar<TServices, ServiceName, "IMAGE_TAG">, z.ZodString> = {
    // This is provided fro, within the CI pipeline where the manifests are generated and pushed to the repo
    SERVICES__GRAPHQL_MONGO__IMAGE_TAG: z.string().min(1),
    SERVICES__GRAPHQL_POSTGRES__IMAGE_TAG: z.string().min(1),
    SERVICES__GRPC_MONGO__IMAGE_TAG: z.string().min(1),
    SERVICES__REACT_WEB__IMAGE_TAG: z.string().min(1),
}

// CONSIDER: Move this into helpers
export const imageTagsObjectValidator = z.object(imageTagsSchema);
export type ImageTags = z.infer<typeof imageTagsObjectValidator>;

// The service, Selected Environment variables that would be passed when generating kubernetes secrets manifests
export type KubeBuildEnvVars = Simplify<
    {
        ENVIRONMENT: Environment;
    } & ImageTags &
    SelectFromServicesEnvVars<
        'graphql-mongo',
        | 'MONGODB_ROOT_PASSWORD'
        | 'MONGODB_PASSWORD'
        | 'MONGODB_ROOT_USERNAME'
        | 'MONGODB_USERNAME'
        | 'REDIS_PASSWORD'
        | 'REDIS_USERNAME'
        | 'OAUTH_GITHUB_CLIENT_ID'
        | 'OAUTH_GITHUB_CLIENT_SECRET'
        | 'OAUTH_GOOGLE_CLIENT_ID'
        | 'OAUTH_GOOGLE_CLIENT_SECRET'
    > &
    SelectFromServicesEnvVars<'graphql-postgres', 'POSTGRES_PASSWORD' | 'POSTGRES_USERNAME'> &
    SelectFromServicesEnvVars<
        'grpc-mongo',
        'MONGODB_ROOT_PASSWORD' | 'MONGODB_PASSWORD' | 'MONGODB_ROOT_USERNAME' | 'MONGODB_USERNAME'
    > &
    SelectFromInfraEnvVars<'argocd', 'ADMIN_PASSWORD' | 'password' | 'type' | 'url' | 'username'> &
    SelectFromInfraEnvVars<'linkerd-viz', 'PASSWORD'>
>;

// type Momo = Record<Uppercase<`${TServices}__${SnakeCase<N>}__`>, string>>
export const getKubeBuildEnvVarsSample = (): KubeBuildEnvVars => {
    return {
        ENVIRONMENT: "" as Environment,
        // This is provided fro, within the CI pipeline where the manifests are generated and pushed to the repo
        SERVICES__GRAPHQL_MONGO__IMAGE_TAG: "",
        SERVICES__GRAPHQL_POSTGRES__IMAGE_TAG: "",
        SERVICES__GRPC_MONGO__IMAGE_TAG: "",
        SERVICES__REACT_WEB__IMAGE_TAG: "",

        SERVICES__GRAPHQL_MONGO__MONGODB_PASSWORD: '',
        SERVICES__GRAPHQL_MONGO__MONGODB_ROOT_PASSWORD: '',
        SERVICES__GRAPHQL_MONGO__MONGODB_ROOT_USERNAME: '',
        SERVICES__GRAPHQL_MONGO__MONGODB_USERNAME: '',
        SERVICES__GRAPHQL_MONGO__OAUTH_GITHUB_CLIENT_ID: '',
        SERVICES__GRAPHQL_MONGO__OAUTH_GITHUB_CLIENT_SECRET: '',
        SERVICES__GRAPHQL_MONGO__OAUTH_GOOGLE_CLIENT_ID: '',
        SERVICES__GRAPHQL_MONGO__OAUTH_GOOGLE_CLIENT_SECRET: '',
        SERVICES__GRAPHQL_MONGO__REDIS_PASSWORD: '',
        SERVICES__GRAPHQL_MONGO__REDIS_USERNAME: '',

        SERVICES__GRPC_MONGO__MONGODB_PASSWORD: '',
        SERVICES__GRPC_MONGO__MONGODB_ROOT_PASSWORD: '',
        SERVICES__GRPC_MONGO__MONGODB_ROOT_USERNAME: '',
        SERVICES__GRPC_MONGO__MONGODB_USERNAME: '',

        SERVICES__GRAPHQL_POSTGRES__POSTGRES_PASSWORD: '',
        SERVICES__GRAPHQL_POSTGRES__POSTGRES_USERNAME: '',

        INFRASTRUCTURE__ARGOCD__ADMIN_PASSWORD: '',
        INFRASTRUCTURE__ARGOCD__PASSWORD: '',
        INFRASTRUCTURE__ARGOCD__TYPE: '',
        INFRASTRUCTURE__ARGOCD__URL: '',
        INFRASTRUCTURE__ARGOCD__USERNAME: '',

        INFRASTRUCTURE__LINKERD_VIZ__PASSWORD: '',
    };

}
export const getKubeBuildEnvVarsSchema = ({ allowEmptyValues }: { allowEmptyValues: boolean }) => {
    // This is done to allow us sync local .env files.
    // When parsing to sync the env var names/keys, we want the values to allow empty
    const string = z.string().min(allowEmptyValues ? 0 : 1);
    const kubeBuildEnvVarsSample = getKubeBuildEnvVarsSample()

    const kubeBuildEnvVarsSchema: Record<keyof KubeBuildEnvVars, z.ZodString> = _.mapValues(
        kubeBuildEnvVarsSample,
        (_) => string
    );
    kubeBuildEnvVarsSchema.ENVIRONMENT = appEnvironmentsSchema as any;

    return z.object(kubeBuildEnvVarsSchema);
};


type Option = {
    check: boolean;
}
export const getEnvVarsForKubeManifests = (option?: Option): KubeBuildEnvVars => {
    dotenv.config({ debug: true });
    const shouldCheck = option?.check === undefined ? true : option.check


    const schema = getKubeBuildEnvVarsSchema({ allowEmptyValues: true });
    return (shouldCheck ? schema.parse(process.env) : process.env) as KubeBuildEnvVars;
};

