#!/bin/bash

# This script is a workaround, because Angular CLI with yarn
# workspaces is not fixed yet: https://github.com/angular/angular-cli/issues/11084

DIR=$( cd "$( dirname "$0" )" && pwd )
OLD_PWD=$PWD
cd "${DIR}/../"
npm i --ignore-scripts
npm run build
cd $OLD_PWD
