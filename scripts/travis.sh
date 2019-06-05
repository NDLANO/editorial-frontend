
#!/bin/bash

set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
yarn start &
yarn e2e-ci
else 
yarn start &
yarn e2e-ci-record
fi