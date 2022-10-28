import os
import subprocess
import sys


def set_version(part: str):
    wd = os.getcwd()
    os.chdir("./json")
    subprocess.run(["poetry", "version", part])
    version = subprocess.run(
        ["poetry", "version", "-s"], capture_output=True, text=True
    ).stdout.rstrip()
    subprocess.run(
        [
            "sed",
            "-i",
            f's/__VERSION__ = "[^"]*"/__VERSION__ = "{version}"/g',
            "main.py",
        ]
    )
    os.chdir(wd)
    os.chdir("./gefyra")
    subprocess.run(["npm", "version", part])


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ["major", "minor", "patch"]:
        print("Only major, minor, patch is allowed as argument")
        exit(1)
    else:

        set_version(sys.argv[1])
