import * as proto from './protocol';

export abstract class GefyraBaseClient {
  protected abstract exec(request: proto.GefyraRequest): Promise<string>

  async status(): Promise<proto.GefyraStatusResponse> {
    const stdout = this.exec(new proto.GefyraStatusRequest());
    const resp = await stdout;
    console.log(resp);
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
