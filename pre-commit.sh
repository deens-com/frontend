#!/bin/bash
source ./.env

if [ $DISABLE_PRECOMMIT == 1 ]
then
  echo "Skipping pre-commit hokk"
else
  npm run lint-staged
fi