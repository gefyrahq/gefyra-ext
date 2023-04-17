import { DockerKillRemoveResponse, DockerKillRequest, DockerListRequest, DockerListResponse, DockerRemoveRequest, GefyraBridgeRequest, GefyraBridgeResponse, GefyraDownRequest, GefyraDownResponse, GefyraListRequest, GefyraListResponse, GefyraRequest, GefyraRunRequest, GefyraRunResponse, GefyraStatusRequest, GefyraStatusResponse, GefyraUnbridgeRequest, GefyraUnbridgeResponse, GefyraUpRequest, GefyraUpResponse, K8sContextRequest, K8sContextResponse, K8sDefaultKubeconfigRequest, K8sDefaultKubeconfigResponse, K8sImagesRequest, K8sImagesResponse, K8sNamespaceRequest, K8sNamespaceResponse, K8sWorkloadsRequest, K8sWorkloadsResponse } from "./protocol";

export abstract class GefyraBaseClient {
  protected abstract exec(request: GefyraRequest): Promise<string>

  async status(): Promise<GefyraStatusResponse> {
    const stdout = await this.exec(new GefyraStatusRequest());
    const resp = await stdout;
    return new GefyraStatusResponse(resp);
  }

  async up(request?: GefyraUpRequest): Promise<GefyraUpResponse> {
    if (!request) {
      request = new GefyraUpRequest();
    }
    const stdout = this.exec(request);
    const resp = await stdout;
    return new GefyraUpResponse(resp);
  }

  async down(): Promise<GefyraDownResponse> {
    const stdout = this.exec(new GefyraDownRequest());
    const resp = await stdout;
    return new GefyraDownResponse(resp);
  }

  async run(request: GefyraRunRequest): Promise<GefyraRunResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new GefyraRunResponse(resp);
  }

  async bridge(request: GefyraBridgeRequest): Promise<GefyraBridgeResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new GefyraBridgeResponse(resp);
  }

  async unbridge(request: GefyraUnbridgeRequest): Promise<GefyraUnbridgeResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new GefyraUnbridgeResponse(resp);
  }

  async list(request: GefyraListRequest): Promise<GefyraListResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new GefyraListResponse(resp);
  }

  async dockerList(request?: DockerListRequest): Promise<DockerListResponse> {
    if (!request) {
      request = new DockerListRequest();
    }
    const stdout = this.exec(request);
    const resp = await stdout;
    return new DockerListResponse(resp);
  }

  async kill(request: DockerKillRequest): Promise<DockerKillRemoveResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new DockerKillRemoveResponse(resp);
  }

  async remove(request: DockerRemoveRequest): Promise<DockerKillRemoveResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new DockerKillRemoveResponse(resp);
  }

  async k8sContexts(request: K8sContextRequest): Promise<K8sContextResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new K8sContextResponse(resp);
  }

  async k8sNamespaces(request: K8sNamespaceRequest): Promise<K8sNamespaceResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new K8sNamespaceResponse(resp);
  }

  async k8sWorkloads(): Promise<K8sWorkloadsResponse> {
    const stdout = this.exec(new K8sWorkloadsRequest());
    const resp = await stdout;
    return new K8sWorkloadsResponse(resp);
  }

  async k8sImages(request: K8sImagesRequest): Promise<K8sImagesResponse> {
    const stdout = this.exec(request);
    const resp = await stdout;
    return new K8sImagesResponse(resp);
  }

  async k8sDefaultKubeconfig(): Promise<K8sDefaultKubeconfigResponse> {
    const stdout = this.exec(new K8sDefaultKubeconfigRequest());
    const resp = await stdout;
    return new K8sDefaultKubeconfigResponse(resp);
  }
}
