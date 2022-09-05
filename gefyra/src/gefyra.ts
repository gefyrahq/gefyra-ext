import { join } from 'path';
import { execSync } from 'child_process';
import { binaryPath } from './install';
import * as proto from './protocol';

export class Gefyra {
  private binary: string;

  constructor(binary: string) {
    this.binary = binary;
  }

  private execSync(request: proto.GefyraRequest): any {
    return execSync(`${this.binary} '${request.serialize()}'`);
  }

  status(): proto.GefyraStatusResponse {
    const res = this.execSync(new proto.GefyraStatusRequest());
    return new proto.GefyraStatusResponse(res);
  }

  up(): proto.GefyraUpResponse {
    const res = this.execSync(new proto.GefyraUpRequest());
    return new proto.GefyraUpResponse(res);
  }

  down(): proto.GefyraDownResponse {
    const res = this.execSync(new proto.GefyraDownRequest());
    return new proto.GefyraDownResponse(res);
  }
}
