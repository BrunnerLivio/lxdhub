# Publish

## Prerequisites

```
npm i -g lerna
```

## npmjs

The packages `@lxdhub/api`, `@lxdhub/db` and `@lxdhub/db` will be
built and publish on npm, when running the following script.
Automatically a new git tag will be created and pushed.

If the CI-Pipeline is integrated, the Dockerimages /api and
/dbsync will be automatically deployed to Dockerhub.

```bash
npm login
./bin/publish.sh
```

## Dockerhub

## Prerequisites

- [docker >=18.02.0-ce](https://www.docker.com/)

```bash

DOCKER_HUB_PASSWORD=your_docker_hub_password DOCKER_HUB_USER=your_docker_hub_user DOCKER_HUB_REPOSITORY=$DOCKER_HUB_USER/lxdhub CI_COMMIT_TAG=1.0.0 ./bin/publish.sh

```
