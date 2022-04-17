import { AppName, Environment } from "./types/own-types";
import path from "path";
import sh from "shelljs";

export const getMainBaseDir = () => {
  const mainBaseDir = path.join(__dirname, "..", "..");
  return mainBaseDir;
};

export const getManifestsBaseDir = () => {
  const MANIFESTS_DIR = path.join(getMainBaseDir(), "manifests");
  return MANIFESTS_DIR;
};

export const getUnsealedSecretsConfigFilesBaseDir = () => {
  return path.join(getMainBaseDir(), ".secrets");
};


export const getGeneratedEnvManifestsDir = (environment: Environment) => {
  const MANIFESTS_DIR = getManifestsBaseDir();
  return path.join(MANIFESTS_DIR, "generated", environment);
};

/**
 * e.g /manifests/generated/local/infrastructure/1-manifests
 *                               /infrastructure/1-crd
 *                               /infrastructure/sealed-secrets
 */
export const getPathToNonApplicationDir = (toolName: string, environment: Environment) => {
  const MANIFESTS_BASE_DIR_FOR_ENV = getGeneratedEnvManifestsDir(environment);
  const dir = path.join(MANIFESTS_BASE_DIR_FOR_ENV, "infrastructure", toolName);
  // TODO: sh.mk`dir(dir);
  // sh.mk`dir(dir);
  return dir;
};

export const getRepoPathFromAbsolutePath = (absolutePath: string) => {
  const toolPath = absolutePath.split("/kubernetes/").at(-1);
  if (!toolPath) {
    throw new Error(`path not found`);
  }
  return path.join("kubernetes", toolPath);
};

export const argocdControllerName = "argocd-controller";
export const getArgocdControllerDir = (environment: Environment) => {
  return getPathToNonApplicationDir(argocdControllerName, environment);
};

export const sealedSecretsControllerName = "sealed-secrets-controller";
export const getSealedSecretsControllerDir = (environment: Environment) => {
  return getPathToNonApplicationDir(sealedSecretsControllerName, environment);
};

export const ingressControllerName = "nginx-ingress-controller";
export const getIngressControllerDir = (environment: Environment) => {
  return getPathToNonApplicationDir(ingressControllerName, environment);
};

export const argocdApplicationName = "argocd-applications";
export const getArgocdApplicationsDir = (environment: Environment) => {
  return getPathToNonApplicationDir(argocdApplicationName, environment);
};

export const getServiceDir = (appName: AppName, environment: Environment) => {
  return path.join(getGeneratedEnvManifestsDir(environment), "services", appName);
  // return `kubernetes/manifests/generated/${environment}/services/${appName}`;
};
