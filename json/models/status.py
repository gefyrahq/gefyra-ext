import dataclasses
from typing import Any

from . import add_action, GefyraRequest


@add_action("gefyra.status")
class StatusRequest(GefyraRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import status
        status = status(config=self.configuration)
        return dataclasses.asdict(status)

