import { applicationsDirectory } from "../shared/manifestsDirectory";
import { ServiceDeployment } from "../shared/deployment";
import { grpcMongoSettings } from "./settings";

export const grpcMongo = new ServiceDeployment("grpc-mongo", grpcMongoSettings, {
  provider: applicationsDirectory,
});

export * from "./mongodb";
