#!/bin/bash
CIRCLE_TAG="$(git tag -l --points-at HEAD)"
VERSION="${CIRCLE_TAG:1}"

echo "========="
echo "RELEASE ${VERSION}"

# Remove "v"-prefix from lerna

# Login to dockerhub
docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD

# Build docker
docker build -t $DOCKER_HUB_REPOSITORY:latest .
docker tag $DOCKER_HUB_REPOSITORY:latest $DOCKER_HUB_REPOSITORY:$VERSION

# Deploy to dockerhub
docker push $DOCKER_HUB_REPOSITORY:latest
docker push $DOCKER_HUB_REPOSITORY:$VERSION


