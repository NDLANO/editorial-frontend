
#!/bin/bash

set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  yarn e2e-ci
  else yarn e2e-ci-record
fi