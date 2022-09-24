import * as proto from './protocol';
import { promisify } from 'util';
import { exec } from 'child_process';
import { GefyraBaseClient } from './base';
const pexec = promisify(exec);

export class Gefyra extends GefyraBaseClient {
  private binary: string;

  constructor(binary: string) {
    super()
    this.binary = binary;
  }

  protected async exec(request: proto.GefyraRequest): Promise<string> {
    const { stdout } = await pexec(`${this.binary} '${request.serialize()}'`);
    return stdout;
  }
}
