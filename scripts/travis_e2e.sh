#!/bin/bash

set -ev
yarn cypress install
yarn build
yarn e2e-ci
