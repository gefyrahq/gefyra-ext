import sys
import json
import socket
import getpass
import traceback

from models import *


def main():
    debug = False
    try:
        arguments = sys.argv[1:]
        if not arguments:
            raise RuntimeError("No JSON argument passed")

        json_raw = arguments[0]
        _input = json.loads(json_raw)
        debug = "debug" in _input and _input["debug"]
        action = select_model(_input)
        result = action.exec()

        reponse = {
            "status": "success",
            "available": get_all_actions(),
            "host": socket.gethostname(),
            "user": getpass.getuser(),
        }
        reponse.update({"response": result})
        print(json.dumps(reponse))
    except Exception as e:
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
