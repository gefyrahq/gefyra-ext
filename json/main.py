import logging
import sys
import json
import socket
import getpass
import traceback

import sentry_sdk

import gefyra.configuration

from models import SentryContext, select_model, get_all_actions

__VERSION__ = "0.7.6"


def main():
    logging.disable()
    debug = False
    try:
        sentry_sdk.init(
            dsn=SentryContext().dsn,
        )
        arguments = sys.argv[1:]
        if not arguments:
            raise RuntimeError("No JSON argument passed")

        json_raw = arguments[0]
        _input = json.loads(json_raw)
        debug = "debug" in _input and _input["debug"]
        action = select_model(_input)
        sentry_sdk.init(
            dsn=action.sentryCtx.dsn,
            release=action.sentryCtx.release,
            environment=action.sentryCtx.environment,
            server_name=action.sentryCtx.server_name,
            debug=action.sentryCtx.debug or debug,
        )
        result = action.exec()

        response = {
            "status": "success",
            "available": get_all_actions(),
            "host": socket.gethostname(),
            "user": getpass.getuser(),
            "apiVersion": gefyra.configuration.__VERSION__,
            "version": __VERSION__,
        }
        response.update({"response": result})
        print(json.dumps(response))
    except Exception as e:
        sentry_sdk.capture_exception(e)
        sentry_sdk.flush()
        if debug:
            print(
                json.dumps(
                    {
                        "status": "error",
                        "exception": str(e.__class__.__name__),
                        "reason": str(e),
                        "trace": traceback.format_exc(),
                    }
                )
            )
        else:
            print(
                json.dumps(
                    {
                        "status": "error",
                        "exception": str(e.__class__.__name__),
                        "reason": str(e),
                    }
                )
            )
        exit(1)
    exit(0)


if __name__ == "__main__":  # noqa
    main()
