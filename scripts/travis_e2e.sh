#!/bin/bash

set -ev
yarn build
yarn e2e-ci
