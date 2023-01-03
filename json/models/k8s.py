from . import add_action, K8sRequest


@add_action("k8s.contexts")
class K8sContextRequest(K8sRequest):
    def exec(self) -> dict:
        from kubernetes import config

        names = []
        contexts, active = config.list_kube_config_contexts(config_file=self.kubeconfig)
        if active:
            active = active["name"]

        for context in contexts:
            if type(context) == dict and "name" in context:
                names.append(context["name"])
        return {"contexts": names, "active": active}


@add_action("k8s.namespaces")
class K8sNamespaceRequest(K8sRequest):
    def exec(self) -> dict:
        from kubernetes import client

        core_api = client.CoreV1Api()
        return {
            "namespaces": [ns.metadata.name for ns in core_api.list_namespace().items]
        }


@add_action("k8s.workloads")
class K8sWorkloadsRequest(K8sRequest):
    def exec(self) -> dict:
        from kubernetes import client

        app_api = client.AppsV1Api()
        core_api = client.CoreV1Api()
        workloads = {}
        for deployment in app_api.list_deployment_for_all_namespaces().items:
            if deployment.metadata.namespace in workloads:
                workloads[deployment.metadata.namespace].append(
                    f"deployment/{deployment.metadata.name}"
                )
            else:
                workloads[deployment.metadata.namespace] = [
                    f"deployment/{deployment.metadata.name}"
                ]
        for statefulset in app_api.list_stateful_set_for_all_namespaces().items:
            if statefulset.metadata.namespace in workloads:
                workloads[statefulset.metadata.namespace].append(
                    f"statefulset/{statefulset.metadata.name}"
                )
            else:
                workloads[statefulset.metadata.namespace] = [
                    f"statefulset/{statefulset.metadata.name}"
                ]

        for pod in core_api.list_pod_for_all_namespaces().items:
            if pod.metadata.namespace in workloads:
                workloads[pod.metadata.namespace].append(f"pod/{pod.metadata.name}")
            else:
                workloads[pod.metadata.namespace] = [f"pod/{pod.metadata.name}"]

        return {
            "workloads": workloads,
        }


@add_action("k8s.images")
class K8sImagesRequest(K8sRequest):
    workload: str = None
    namespace: str

    def exec(self) -> dict:
        from kubernetes import client

        if self.workload:
            app_api = client.AppsV1Api()
            type, name = self.workload.split("/")
            if type == "deployment":
                _object = app_api.read_namespaced_deployment(
                    namespace=self.namespace, name=name
                )
            elif type == "statefulset":
                _object = app_api.read_namespaced_stateful_set(
                    namespace=self.namespace, name=name
                )
            else:
                raise RuntimeError(f"Workload type not supported: {type}")
            containers = _object.spec.template.spec.containers
            images = []
            for container in containers:
                images.append(
                    {
                        "image": container.image,
                        "ports": [port.container_port for port in container.ports]
                        if container.ports
                        else [],
                    }
                )
            return {"containers": images}
        else:
            core_api = client.CoreV1Api()
            images = []
            _img = set()
            for pod in core_api.list_namespaced_pod(namespace=self.namespace).items:
                for container in pod.spec.containers:
                    if container.image not in _img:
                        images.append(
                            {
                                "image": container.image,
                                "ports": [
                                    port.container_port for port in container.ports
                                ]
                                if container.ports
                                else [],
                            }
                        )
                        _img.add(container.image)
            return {"containers": images}
