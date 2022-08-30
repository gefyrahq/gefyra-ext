from pydantic import BaseModel


def select_model(data: dict):
    if data.get("action"):
        if data["action"].lower() == "status":
            return StatusRequest(**data)
        elif data["action"].lower() == "k8s/list/namespaces":
            return K8sNamespaceRequest(**data)
        else:
            raise RuntimeError(f"The action '{data['action']}' is currently not supported")
    else:
        raise RuntimeError("No valid action given")


class Action(BaseModel):
    debug: bool = False
    action: str

    def exec(self) -> dict:
        raise NotImplementedError()


class StatusRequest(Action):
    requested: bool = True

    def exec(self) -> dict:
        return {"status": "up"}


class K8sNamespaceRequest(Action):

    def exec(self) -> dict:
        from kubernetes import client, config

        config.load_kube_config()
        core_api = client.CoreV1Api()
        return {
            "namespaces": [ns.metadata.name for ns in core_api.list_namespace().items]
        }
