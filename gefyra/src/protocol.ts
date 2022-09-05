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
