import docker
import logging
import sys
import json
import socket
import getpass
import traceback

import sentry_sdk

from models import SentryContext

logging.disable()


sentry_sdk.init(
    dsn=SentryContext().dsn,
)

__VERSION__ = "0.7.16"

def fix_pywin32_in_frozen_build() -> None:  # pragma: no cover
    import os
    import site

    if sys.platform != "win32" or not getattr(sys, "frozen", False):
        return

    site.addsitedir(sys.path[0])
    customsite = os.path.join(sys.path[0], "lib")
    site.addsitedir(customsite)

    # sys.path has been extended; use final
    # path to locate dll folder and add it to path
    path = sys.path[-1]
    path = path.replace("Pythonwin", "pywin32_system32")
    os.environ["PATH"] += ";" + path

    # import pythoncom module
    import importlib
    import importlib.machinery

    for name in ["pythoncom", "pywintypes", "win32file"]:
        filename = os.path.join(path, name + "39.dll")
        loader = importlib.machinery.ExtensionFileLoader(name, filename)
        spec = importlib.machinery.ModuleSpec(name=name, loader=loader, origin=filename)
        importlib._bootstrap._load(spec)  # type: ignore


def main():
    if sys.platform == "win32": 
        fix_pywin32_in_frozen_build()
    import docker.transport.npipesocket
    print("Import workz")
    c = docker.from_env()
    print(c.info())
    import gefyra.configuration
    from models import select_model, get_all_actions

    debug = False
    try:
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
