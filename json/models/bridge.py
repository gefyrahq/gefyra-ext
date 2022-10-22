from typing import Any, List

from . import add_action, GefyraRequest


@add_action("gefyra.bridge")
class BridgeRequest(GefyraRequest):

    name: str
    ports: dict
    target: str
    namespace: str = "default",
    syncdowndirs: List[str] = None
    handleprobes: bool = True
    timeout: int = 0

    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import bridge

        success = bridge(
            name=self.name,
            ports=self.ports,
            target=self.target,
            namespace=self.namespace,
            sync_down_dirs=self.syncdowndirs,
            handle_probes=self.handleprobes,
            timeout=self.timeout,
            config=self.configuration)
        return {"status": success}
