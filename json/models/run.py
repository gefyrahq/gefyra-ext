from typing import Any

from . import add_action, GefyraRequest


@add_action("gefyra.run")
class RunRequest(GefyraRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import run

        success = run(config=self.configuration)
        return {"status": success}
