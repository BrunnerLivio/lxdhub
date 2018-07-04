#!/bin/bash

PREVIOUS_PWD=$PWD
DIR="$( cd "$(dirname "$0")" ; pwd -P )"

cd "${DIR}/.."

npm i --ignore-scripts
npm run build

cd $PREVIOUS_PWD
