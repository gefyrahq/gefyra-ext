import { join } from 'path';
import { execSync } from 'child_process';
import { binaryPath } from './install';
import { GefyraStatusRequest, GefyraRequest, GefyraStatusResponse } from './protocol';

export class Gefyra {
  binary: string;

  constructor(binary: string) {
    this.binary = binary;
  }

  private execSync(request: GefyraRequest): any {
    return execSync(`${this.binary} '${request.serialize()}'`);
  }

  status(): GefyraStatusResponse {
    const res = this.execSync(new GefyraStatusRequest());
    return new GefyraStatusResponse(res);
  }
}

const gefyra = new Gefyra(binaryPath);
export default gefyra;
