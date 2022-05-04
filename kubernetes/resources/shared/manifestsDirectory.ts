import { AppName, Environment } from "./types/own-types";
import path from "path";
import sh from "shelljs";
import * as k8s from "@pulumi/kubernetes";
import { v4 as uuid } from "uuid";

// TODO:  Unify all the resourceType/resourceName path utils into a singular function e.g

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

const argoApplicationsNames = [
  "namespace-names",
  "sealed-secrets",
  "cert-manager",
  "nginx-ingress",
  "linkerd",
  "linkerd-viz",
  "argocd",
  // "argocd-parent-applications",
  // "argocd-children-applications",
  "services-argocd-applications",
  "infrastructure-argocd-applications",
  // "service",
] as const;

export type ArgoApplicationName = typeof argoApplicationsNames[number];
// export type ArgoParentApplications = "argocd-parent-applications"

export type ResourceType =
  | "infrastructure"
  | "services"
  | "namespaces"
// | ArgoParentApplications;


// We don't want argocd-parent-applications-argocd-parent-applications
// export type ArgoResourceName = `${Exclude<ResourceType, ArgoParentApplications>}-${ArgoParentApplications}`

export type ResourceName = ArgoApplicationName | AppName;


export const getPathToResourcesDir = (
  resourceName: ResourceName,
  resourceType: ResourceType,
  environment: Environment
) => {
  return path.join(
    getGeneratedEnvManifestsDir(environment),
    resourceType,
    resourceName
  );
  // return `kubernetes/manifests/generated/${environment}/services/${appName}`;
};

/**
 * e.g /manifests/generated/local/infrastructure/1-manifests
 *                               /infrastructure/1-crd
 *                               /infrastructure/sealed-secrets
 */

export const getRepoPathFromAbsolutePath = (absolutePath: string) => {
  const toolPath = absolutePath.split("/kubernetes/").at(-1);
  if (!toolPath) {
    throw new Error(`path not found`);
  }
  return path.join("kubernetes", toolPath);
};

function getResourceProperties<T>(
  resourceName: ResourceName,
  onGetResourceProperties: (resourceName: ResourceType) => T
): T {
  switch (resourceName) {
    case "react-web":
    case "graphql-mongo":
    case "graphql-postgres":
    case "grpc-mongo":
    case "services-argocd-applications":
      {
        return onGetResourceProperties("services");
      }

    case "argocd":
    case "cert-manager":
    case "linkerd":
    case "sealed-secrets":
    case "linkerd-viz":
    case "namespace-names":
    case "nginx-ingress":
    case "infrastructure-argocd-applications":
      {
        return onGetResourceProperties("infrastructure");
      }
  }
  return assertUnreachable(resourceName);
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

type GetPathToResourceProps = {
  resourceType: ResourceType;
  // resourceName: Omit<ArgoApplicationName | AppName, "service">
  resourceName: ResourceName;
  environment: Environment;
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const getPathToResourceType = (props: Omit<GetPathToResourceProps, "resourceName">): string => {
  const resourcePath = path.join(
    getGeneratedEnvManifestsDir(props.environment),
    props.resourceType,
  );
  return resourcePath;
};

export const getPathToResource = (props: GetPathToResourceProps): string => {
  return path.join(getPathToResourceType(props), props.resourceName);
};

export function getResourceAbsolutePath(
  resourceName: ResourceName,
  environment: Environment
): string {
  return getResourceProperties(resourceName, (resourceType) => {

    return getPathToResource({
      resourceName,
      resourceType,
      environment,
    })
  }
  );
}

export function getResourceRelativePath(
  resourceName: ResourceName,
  environment: Environment
): string {
  const pathAbsolute = getResourceAbsolutePath(resourceName, environment);
  return getRepoPathFromAbsolutePath(pathAbsolute);
}
export function getResourceProvider(
  resourceName: ResourceName,
  environment: Environment
): k8s.Provider {
  return getResourceProperties(resourceName, (resourceType) => {
    return new k8s.Provider(`${resourceType}-${resourceName}-${uuid()}`, {
      renderYamlToDirectory: getResourceAbsolutePath(resourceName, environment),
    });
  });
}

/* 
// We want argo-applications to be in the same folder
// resources may be for
          kubernetes/manifests/generated/local/infrastructure/linkerd
          kubernetes/manifests/generated/local/infrastructure/cert-manager
   
    The argo applications will be in:
          kubernetes/manifests/generated/local/infrastructure/argo-applications/(application-argo-linkerd, application-argo-cert-manager)
 */

export function getArgocdChildrenApplicationsAbsolutePath(resourceType: ResourceType, environment: Environment) {
  return path.join(getPathToResourceType({ resourceType, environment }), ARGO_APPLICATIONS_DIR_NAME)
}
const ARGO_APPLICATIONS_DIR_NAME = "argo-children-applications"
export function getArgocdChildrenResourcesProvider(
  resourceName: ResourceName,
  // resourceType: ResourceType,
  environment: Environment
): k8s.Provider {
  return getResourceProperties(resourceName, (resourceType) => {
    return new k8s.Provider(`${resourceType}-${resourceName}-${uuid()}`, {
      renderYamlToDirectory: getArgocdChildrenApplicationsAbsolutePath(resourceType, environment),
    });
  });
}


// export function getArgoParentsResourcesProvider(
//   resourceName: ResourceName,
//   environment: Environment
// ): k8s.Provider {
//   return getResourceProperties(resourceName, (resourceType) => {
//     return new k8s.Provider(`${resourceType}-${resourceName}-${uuid()}`, {
//       renderYamlToDirectory: path.join(getResourceAbsolutePath(resourceName, environment), ".."),
//     });
//   });
// }


export const getRelativePathToArgocdChildrenResource = (
  resourceType: ResourceType,
  environment: Environment
) => {
  return getRepoPathFromAbsolutePath(path.join(
    getGeneratedEnvManifestsDir(environment),
    resourceType,
    ARGO_APPLICATIONS_DIR_NAME
  ));
  // return `kubernetes/manifests/generated/${environment}/services/${appName}`;
};
