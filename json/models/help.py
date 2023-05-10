from typing import Any

from pydantic import BaseModel

from . import SentryContext, add_action


@add_action("help")
class HelpRequest(BaseModel):
    sentryCtx: SentryContext = SentryContext()

    def __init__(self, **data: Any):
        super().__init__(**data)

    def exec(self) -> dict:
        return {}
