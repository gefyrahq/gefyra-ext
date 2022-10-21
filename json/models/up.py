from typing import Any


from . import add_action, GefyraRequest


@add_action("gefyra.up")
class UpRequest(GefyraRequest):

    endpoint: str = None
    minikube: bool = False

    def __init__(self, **data: Any):
        super().__init__(**data)

    def _get_connection_from_kubeconfig(self):
        import yaml

        try:
            with open(self.kubeconfig, "r") as _kubeconfig:
                kubecfg = yaml.safe_load(_kubeconfig)
            active_ctx = next(
                filter(
                    lambda x: x["name"] == kubecfg["current-context"], kubecfg["contexts"]
                )
            )
            if gefyra_connection := active_ctx.get("gefyra"):
                return gefyra_connection
            else:
                return None
        except Exception as e:  # noqa
            return None


    @property
    def configuration(self):
        from gefyra.configuration import ClientConfiguration
        from gefyra.local.minikube import detect_minikube_config

        configuration_params = {}

        if self.minikube and bool(self.endpoint):
            raise RuntimeError("You cannot use 'endpoint' together with 'minikube'.")

        if self.minikube:
            configuration_params.update(detect_minikube_config())
        else:
            if not self.endpoint:
                # try read the endpoint from Beiboot kubeconfig
                endpoint = self._get_connection_from_kubeconfig()
            else:
                endpoint = self.endpoint

            configuration_params["cargo_endpoint"] = endpoint

        configuration_params["kube_config_file"] = self.kubeconfig
        configuration_params["kube_context"] = self.context

        # we currently don't support all configuration cases
        return ClientConfiguration(**configuration_params)

    def exec(self) -> dict:
        from gefyra.api import up
        success = up(config=self.configuration)
        return {"status": success}
