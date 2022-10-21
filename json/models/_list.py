from typing import Any

from . import add_action, GefyraRequest


@add_action("gefyra.list")
class ListRequest(GefyraRequest):
    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        from gefyra.api import list as _list

        try:
            containers = _list.list_containers(config=self.configuration)
            ireqs = _list.list_interceptrequests(config=self.configuration)
            return {"containers": containers, "bridges": ireqs}
        except Exception as e:
            raise e from None
