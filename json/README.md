#  Gefyra JSON
This is a Gefyra API wrapper as binary with JSON as exchange format.

## JSON Request
A JSON request can be submitted with

```bash
python main.py '{"action": "k8s.images", "workload": "deployment/gefyra-operator", "namespace": "gefyra"}'
```

The response will be JSON:

```bash
{"status": "success", "available": ["gefyra.status", "gefyra.up", "gefyra.down", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "response": {"containers": [{"image": "quay.io/gefyra/operator:0.10.2", "ports": []}]}}
```


## Available 'actions'
Every repsonse contains a list of all possible action values:

```bash
"available": ["gefyra.status", "gefyra.up", "gefyra.down", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"]
```

## Fields/Interface
Please consult the `models.py` for the [pydantic](https://pydantic-docs.helpmanual.io/) interfaces and available
fields.

