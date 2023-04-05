from . import add_action, DockerRequest


@add_action("docker.list")
class DockerListRequest(DockerRequest):
    prefix: str = None
    gefyra: bool = True  # list only containers from the gefyra network
    networkname: str = "gefyra"

    def exec(self) -> dict:
        results = []
        if self.gefyra:
            ns = self.client.networks.get(self.networkname)
            containers = ns.containers
        else:
            containers = self.client.containers.list()
        if self.prefix:
            for container in containers:
                if str(container.name).startswith(self.prefix):
                    results.append(container)
        else:
            results = containers
        return {
            "containers": [
                {
                    "name": str(c.name),
                    "id": str(c.id),
                    "image": c.image.tags[0],
                    "status": str(c.status),
                }
                for c in results
            ]
        }


@add_action("docker.kill")
class DockerKillRequest(DockerRequest):
    name: str

    def exec(self) -> dict:
        container = self.client.containers.get(self.name)
        container.kill()
        return {"success": True, "container": container.id}


@add_action("docker.remove")
class DockerRemoveRequest(DockerRequest):
    name: str
    force: bool = None

    def exec(self) -> dict:
        container = self.client.containers.get(self.name)
        container.remove(force=self.force)
        return {"success": True, "container": container.id}
