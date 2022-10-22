#  Gefyra JSON Development
This is a Gefyra API wrapper as binary with JSON as exchange format.

## Setup
Set up the environment using [Poetry](https://python-poetry.org/).

## Run a command
The `gefyra-json` executable accepts only one argument: a JSON-serialized string.
This argument containers the control request and parameters for a Gefyra action. For development,
please run all commands like so (from within this directory):
```bash
poetry run python main.py <argument>
```
**Examples**
```bash
> poetry run python main.py
{"status": "error", "exception": "RuntimeError", "reason": "No JSON argument passed"}

> poetry run python main.py '{"action": "gefyra.status"}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"summary": "Gefyra is not running", "cluster": {"connected": true, "operator": false, "operator_image": "", "stowaway": false, "stowaway_image": "", "namespace": false}, "client": {"version": "", "cargo": false, "cargo_image": "quay.io/gefyra/cargo:0.12.0", "network": false, "connection": false, "containers": 0, "bridges": 0, "kubeconfig": "~/.kube/config", "context": "arn:aws:eks:eu-west-1:669575163673:cluster/delete-me", "cargo_endpoint": ""}}}

> poetry run python main.py '{"action": "help"}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {}}

> poetry run python main.py '{"action": "blubb"}'
{"status": "error", "exception": "RuntimeError", "reason": "The action 'blubb' is currently not supported"}

> poetry run python main.py '{"action": "blubb", "debug": true}'
{"status": "error", "exception": "RuntimeError", "reason": "The action 'blubb' is currently not supported", "trace": "Traceback (most recent call last):\n  File \"/home/mschilonka/workspace/gefyra-ext/json/main.py\", line 25, in main\n    action = select_model(_input)\n  File \"/home/mschilonka/workspace/gefyra-ext/json/models/__init__.py\", line 21, in select_model\n    raise RuntimeError(\nRuntimeError: The action 'blubb' is currently not supported\n"}
```

## Working on models
The protocol for the JSON-based communication is defined in pydantic models. There is a
hierarchy of `ActionRequest` models in `models/` with the base models being placed in `models/__init__.py`.
Each "action" is defined with a model that specifies the parameters for that action. There are a couple
of base parameters available for any action.

### Registering an action
Please register a new action using the decorator:
```python
@add_action("gefyra.up")
class UpRequest(GefyraRequest):
[...]
```
`add_action` takes the argument `name` which will be the name of the action when calling it.
There is a simple namespacing: 
- all Gefyra API actions go with "gefyra.<name>"
- all Kubernetes-related helper actions go with "k8s.<name>"
- anything else is put just plain, e.g "help"
That's it. It'll be a mess if you register multiple actions with the same `name`.


### def exec(self) -> dict:
Each model must implement the `exec` method following this signature:
```python
def exec(self) -> dict:
  # do some crazy
  return {}
```
Please make sure that the returned `dict` is JSON serializable (so no complex data types allowed). If there
is not really a meaningful answer, just return something like `{"success": success}`.

### Creating a new model/action
Don't forget to import your new Python module in `models/__init__.py`:
```python
from .help import *  # noqa
from .up import *  # noqa
from .down import *  # noqa
from .status import *  # noqa

[...]
```

## Creating a platform specific binary
Before creating a release, it's a good practise to compile a platform specify executable on a local machine.
This will prevent unusable binaries to be created on GitHub wasting action runner time.
It's simple.

### Linux
1) Download PyOxidizer
`wget https://github.com/indygreg/PyOxidizer/releases/download/pyoxidizer%2F0.18.0/pyoxidizer-0.18.0-linux-x86_64.zip`
2) Extract it
`unzip pyoxidizer-0.18.0-linux-x86_64.zip`
3) Make it executable
`sudo chmod +x ./pyoxidizer`
4) Compile the code
`./pyoxidizer build exe --release`
5) Test the executable from the build directory
```bash
./build/x86_64-unknown-linux-gnu/release/exe/gefyra-json
> {"status": "error", "exception": "RuntimeError", "reason": "No JSON argument passed"}
```
Perform some more tests (see the getting started test below).

### Mac
1) Download PyOxidizer
`wget https://github.com/indygreg/PyOxidizer/releases/download/pyoxidizer%2F0.18.0/pyoxidizer-0.18.0-macos-universal.zip`
2) Extract it
`unzip pyoxidizer-0.18.0-macos-universal.zip`
3) Make it executable
`sudo chmod +x ./macos-universal/pyoxidizer`
4) Compile the code
`./macos-universal/pyoxidizer build exe --release`
5) Test the executable from the build directory
```bash
./build/[...]/release/exe/gefyra-json
> {"status": "error", "exception": "RuntimeError", "reason": "No JSON argument passed"}
```
Perform some more tests (see the getting started test below).

## Running the 'getting started guide' with k3d
Change the current working directory to the build output (e.g. `cd ./build/x86_64-unknown-linux-gnu/release/exe/`) so
you can simply copy and paste the commands from below.

1) Create a local Kubernetes cluster with k3d like so:
`k3d cluster create mycluster --agents 1 -p 8080:80@agent:0 -p 31820:31820/UDP@agent:0`
This creates a Kubernetes cluster that binds port 8080 and 31820 to localhost. `kubectl` context is immediately set to this cluster.
2) Apply some workload:
`kubectl apply -f https://raw.githubusercontent.com/gefyrahq/gefyra/main/testing/workloads/hello.yaml`
Check out this workload running under: http://hello.127.0.0.1.nip.io:8080/
3) gefyra up (this takes some time with no output)
```bash
> ./gefyra-json '{"action": "gefyra.up"}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"status": true}}
```
4) gefyra run (suppose you have a local image called `pyserver`)
```bash
> ./gefyra-json '{"action": "gefyra.run", "image": "pyserver", "name": "mypyserver", "namespace": "default", "autoremove": true}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.run", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"status": true}}
```
5) gefyra bridge
```bash
> ./gefyra-json '{"action": "gefyra.bridge", "name": "mypyserver", "target": "deployment/hello-nginxdemo/hello-nginx", "ports": {"80":"8000"}, "namespace": "default"}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.run", "gefyra.bridge", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"status": true}} 
```
Please check the output of http://hello.127.0.0.1.nip.io:8080/ 

6) gefyra list
```bash
> ./gefyra-json '{"action": "gefyra.list"}'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.run", "gefyra.bridge", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"containers": [["mypyserver", "172.22.0.2", "default"]], "bridges": ["mypyserver-to-default.deployment.hello-nginxdemo"]}}
```
7) gefyra down
```bash
> ./gefyra-json '{"action": "gefyra.down"'
{"status": "success", "available": ["help", "gefyra.up", "gefyra.down", "gefyra.status", "gefyra.run", "gefyra.list", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "apiVersion": "0.12.0", "version": "0.1.0", "response": {"status": true}}
```