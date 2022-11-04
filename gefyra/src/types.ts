
export type GefyraRunInnerResponse = {
	status: boolean; 
}

export type GefyraBridgeInnerResponse = {
  containers: string[],
  bridges: string[]
}

export type DockerListInnerResponse = {
  containers: {
    name: string,
    id: string,
    image: string,
    status: string,
  },
}

export type DockerKillRemoveInnerResponse = {
  success: boolean,
  container: string,
}

export type K8sContextInnerResponse = {
  contexts: string[],
  active: boolean,
}

export type K8sNamespaceInnerResponse = {
  namespaces: string[],
}

export type K8sWorkloadsInnerResponse = {
  workloads: {
    namespace: {
      name: string,
    }
  }
}

type K8sContainers = {
  image: string,
  ports: number[],
}

export type K8sImagesInnerResponse =  {
  containers: K8sContainers[],
}
