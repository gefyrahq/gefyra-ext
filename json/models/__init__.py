from typing import Any

from docker import DockerClient
from pydantic import BaseModel

__ACTIONS__ = {}


def add_action(cls):
    def decorator(*args, **kwargs):
        __ACTIONS__[cls] = args[0]

    return decorator


def select_model(data: dict):
    if data.get("action"):
        action = __ACTIONS__.get(data["action"].lower())
        if action:
            return action(**data)
        else:
            raise RuntimeError(
                f"The action '{data['action']}' is currently not supported"
            )
    else:
        raise RuntimeError("No valid action given")


def get_all_actions() -> list[str]:
    return list(__ACTIONS__.keys())


class ActionRequest(BaseModel):
    debug: bool = False
    action: str
    kubeconfig: str = None
    context: str = None

    def exec(self) -> dict:
        raise NotImplementedError()


class GefyraRequest(ActionRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)

    @property
    def configuration(self):
        from gefyra.configuration import ClientConfiguration

        return ClientConfiguration(
            kube_config_file=self.kubeconfig, kube_context=self.context
        )


class K8sRequest(ActionRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)
        self._load_kube_config()

    def _load_kube_config(self):
        from kubernetes import config

        config.load_kube_config(config_file=self.kubeconfig, context=self.context)


class DockerRequest(ActionRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)

    @property
    def client(self) -> DockerClient:
        import docker

        return docker.from_env()


from .help import *  # noqa
from .up import *  # noqa
from .down import *  # noqa
from .status import *  # noqa
from .run import *  # noqa
from .bridge import *  # noqa
from .unbridge import *  # noqa
from ._list import *  # noqa
from .k8s import *  # noqa
from .docker import *  # noqa
