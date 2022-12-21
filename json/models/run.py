from typing import Any

from . import add_action, GefyraRequest


@add_action("gefyra.run")
class RunRequest(GefyraRequest):

    image: str
    name: str = None
    command: str = None
    volumes: list[str] = []
    ports: dict = None
    detach: bool = True
    autoremove: bool = False
    namespace: str = None
    env: list = None
    envfrom: str = None

    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import run

        success = run(
            image=self.image,
            name=self.name,
            command=self.command,
            volumes=self.volumes,
            ports=self.ports,
            detach=self.detach,
            auto_remove=self.autoremove,
            namespace=self.namespace,
            env=self.env,
            env_from=self.envfrom,
            config=self.configuration,
        )
        return {"status": success}
