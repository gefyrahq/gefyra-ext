import {GefyraRunInnerResponse, GefyraBridgeInnerResponse, DockerListInnerResponse, DockerKillRemoveInnerResponse, K8sContextInnerResponse, K8sNamespaceInnerResponse, K8sWorkloadsInnerResponse, K8sImagesInnerResponse, GefyraInnterStatusResponse, K8sDefaultKubeconfigInnerResponse} from './types'
/* tslint:disable:max-classes-per-file */
// ===== API Requests ====

export class GefyraRequest {
  action!: string;

  serialize(): string {
    return JSON.stringify(this);
  }
}

export class GefyraStatusRequest extends GefyraRequest {
  constructor() {
    super();
    this.action = 'gefyra.status';
  }
}

export class GefyraUpRequest extends GefyraRequest {
  host?: string;
  port?: number;
  minikube?: boolean;
  kubeconfig?: string;
  context?: string;

  constructor() {
    super();
    this.action = 'gefyra.up';
  }
}

export class GefyraDownRequest extends GefyraRequest {
  constructor() {
    super();
    this.action = 'gefyra.down';
  }
}

export class GefyraRunRequest extends GefyraRequest {
  image!: string;
  name?: string;
  command?: string;
  // volumes and ports are tbd
  volumes?: string[];
  ports?: { [key: string]: string };
  detach?: boolean;
  autoremove?: boolean;
  namespace?: string;
  env?: string[];
  envfrom?: string;
  
  constructor() {
    super();
    this.action = 'gefyra.run';
  }
}

export class GefyraBridgeRequest extends GefyraRequest {
  name!: string;
  ports?: { [key: string]: string };
  target!: string;
  namespace?: string;
  syncDownDirs?: string[];
  handleprobes?: boolean;
  timeout?: number;

  constructor() {
    super();
    this.action = 'gefyra.bridge'
  }
}

export class GefyraHelpRequest extends GefyraRequest {
  constructor() {
    super();
    this.action = 'help';
  }
}

// ===== Docker Requests ====

export class DockerListRequest extends GefyraRequest {
  prefix?: string;
  gefyra: boolean = true;
  networkname: string = 'gefyra';
  
  constructor() {
    super();
    this.action = 'docker.list'
  }
}

export class DockerKillRequest extends GefyraRequest {
  name!: string;

  constructor() {
    super();
    this.action = 'docker.kill'
  }
}

export class DockerRemoveRequest extends GefyraRequest {
  name!: string;
  force?: boolean;

  constructor() {
    super();
    this.action = 'docker.remove'
  }
}



// ===== K8s Requests ====
export class K8sRequest {
  action!: string;
  kubeconfig?: string;
  context?: string;

  serialize(): string {
    return JSON.stringify(this);
  }
}

export class K8sContextRequest extends K8sRequest {
  constructor() {
    super();
    this.action = 'k8s.contexts';
  }  
}

export class K8sNamespaceRequest extends K8sRequest {
  constructor() {
    super();
    this.action = 'k8s.namespaces'
  }
}

export class K8sWorkloadsRequest extends K8sRequest {
  constructor() {
    super();
    this.action = 'k8s.workloads'
  }
}

export class K8sImagesRequest extends K8sRequest {
  constructor() {
    super();
    this.action = 'k8s.images';
  }
}

export class K8sDefaultKubeconfigRequest extends K8sRequest {
  constructor() {
    super();
    this.action = 'k8s.defaultKubeconfig';
  }
}

// ===== APi Respones ====
class GefyraResponse {
  status!: string;
  success?: boolean;
  host?: string;
  user?: string;
  apiVersion?: string;
  version?: string
  response?: any;

  constructor(res: string) {
    this.deserialize(res);
  }

  protected deserialize(res: string): any {
    const obj = JSON.parse(res);
    this.status = obj.status;
    this.success = obj.status === 'success';
    this.host = obj.host;
    this.user = obj.user;
    this.version = obj.version
    this.apiVersion = obj.apiVersion
    if (obj.response) {
      this.response = obj.response;
    }
    return obj;
  }
}

export class GefyraStatusResponse extends GefyraResponse {
  response!: GefyraInnterStatusResponse; 
}

export class GefyraUpResponse extends GefyraResponse {
  constructor(res: string) {
    super(res);
    const obj = this.deserialize(res);
    this.status = obj.status;
  }
}

export class GefyraDownResponse extends GefyraResponse {
  constructor(res: string) {
    super(res);
    const obj = this.deserialize(res);
    this.status = obj.status;
  }
}

export class GefyraRunResponse extends GefyraResponse {
  response!: GefyraRunInnerResponse;  
}

export class GefyraBridgeResponse extends GefyraResponse {
  response!: GefyraBridgeInnerResponse; 

  constructor(res: string) {
    super(res);
    const obj = this.deserialize(res)
    this.response = obj.response;
  }
}

export class DockerListResponse extends GefyraResponse {
  response!: DockerListInnerResponse;
}

export class DockerKillRemoveResponse extends GefyraResponse {
  response!: DockerKillRemoveInnerResponse;
}

export class K8sContextResponse extends GefyraResponse {
  response!: K8sContextInnerResponse;
}

export class K8sNamespaceResponse extends GefyraResponse {
  response!: K8sNamespaceInnerResponse;
}

export class K8sWorkloadsResponse extends GefyraResponse {
  response!: K8sWorkloadsInnerResponse;
}

export class K8sImagesResponse extends GefyraResponse {
  response!: K8sImagesInnerResponse;
}

export class K8sDefaultKubeconfigResponse extends GefyraResponse {
  response!: K8sDefaultKubeconfigInnerResponse;
}
