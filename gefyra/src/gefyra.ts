import { join } from 'path';
import { binaryPath } from './install';
import * as proto from './protocol';
import util = require('util');
import { exec } from 'child_process';
const pexec = util.promisify(exec);

export class Gefyra {
  private binary: string;

  constructor(binary: string) {
    this.binary = binary;
  }

  protected async exec(request: proto.GefyraRequest) {
    const { stdout } = await pexec(`${this.binary} '${request.serialize()}'`);
    return stdout;
  }

  async status(): Promise<proto.GefyraStatusResponse> {
    const stdout = this.exec(new proto.GefyraStatusRequest());
    const resp = await stdout;
    return new proto.GefyraStatusResponse(resp);
  }

  async up(): Promise<proto.GefyraUpResponse> {
    const stdout = this.exec(new proto.GefyraUpRequest());
    const resp = await stdout;
    return new proto.GefyraUpResponse(resp);
  }

  async down(): Promise<proto.GefyraDownResponse> {
    const stdout = this.exec(new proto.GefyraDownRequest());
    const resp = await stdout;
    return new proto.GefyraDownResponse(resp);
  }
}
