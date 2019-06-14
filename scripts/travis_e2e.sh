#!/bin/bash

set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
yarn build
yarn e2e-ci
else 
yarn build
yarn e2e-ci
fi