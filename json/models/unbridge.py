from typing import Any

from . import add_action, GefyraRequest


@add_action("gefyra.unbridge")
class UnbridgeRequest(GefyraRequest):

    name: str

    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import unbridge

        success = unbridge(
            name=self.name,
            config=self.configuration,
        )
        return {"status": success}
