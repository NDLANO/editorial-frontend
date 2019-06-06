#!/bin/bash

set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "true" ]; then
yarn build
travis_wait yarn ndla-scripts now-travis
fi