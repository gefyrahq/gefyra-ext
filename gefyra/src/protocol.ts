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
  endpoint?: string;
  minikube?: boolean;

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
  ports?: string[];
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
  ports!: string[];
  target!: string;
  namespace?: string;
  syncDownDirs?: string[];
  handleprobes?: boolean;
  timeout?: Number;

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

// ===== APi Respones ====
class GefyraResponse {
  status!: string;
  success!: boolean;
  host!: string;
  user!: string;

  protected deserialize(res: string): any {
    const obj = JSON.parse(res);
    this.status = obj.status;
    this.success = obj.status === 'success';
    this.host = obj.host;
    this.user = obj.user;
    return obj.response;
  }
}

export class GefyraStatusResponse extends GefyraResponse {
  status!: string;

  constructor(res: string) {
    super();
    const obj = this.deserialize(res);
    this.status = obj.status;
  }
}

export class GefyraUpResponse extends GefyraResponse {
  status!: string;

  constructor(res: string) {
    super();
    const obj = this.deserialize(res);
    this.status = obj.status;
  }
}

export class GefyraDownResponse extends GefyraResponse {
  status!: string;

  constructor(res: string) {
    super();
    const obj = this.deserialize(res);
    this.status = obj.status;
  }
}

export class GefyraRunResponse extends GefyraResponse {
  status!: string;
  host!: string;
  user!: string;
  apiVersion!: string;
  version!: string;
  response!: GefyraRunInnerResponse; 
  
  constructor(res: string) {
    super();
    const obj = this.deserialize(res)
    this.status = obj.status;
    this.host = obj.host;
    this.user = obj.user;
    this.apiVersion = obj.apiVersion;
    this.version = obj.version;
    this.response = obj.response;
  }
}

export class GefyraBridgeResponse extends GefyraResponse {
  status!: string;
  host!: string;
  user!: string;
  apiVersion!: string;
  version!: string;
  response!: GefyraBridgeInnerResponse; 

  constructor(res: string) {
    super();
    const obj = this.deserialize(res)
    this.status = obj.status;
    this.host = obj.host;
    this.user = obj.user;
    this.apiVersion = obj.apiVersion;
    this.version = obj.version;
    this.response = obj.response;
  }
}


// TODO Move somewhere else
type GefyraRunInnerResponse = {
	status: boolean; 
}

type GefyraBridgeInnerResponse = {
  containers: string[],
  bridges: string[]
}
