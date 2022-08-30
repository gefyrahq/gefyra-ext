import sys
import json
import traceback
from typing import List

from models import *


def main(arguments: List[str]):
    debug = False

    try:
        json_raw = arguments[0]
        _input = json.loads(json_raw)
        debug = "debug" in _input and _input["debug"]
        action = select_model(_input)
        result = action.exec()
        basic_val = {"status": "success"}
        basic_val.update({"response": result})

        print(json.dumps(basic_val))
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
    main(sys.argv[1:])
