#!/bin/bash

set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "true" ]; then
yarn build
yarn ndla-scripts now-travis
fi