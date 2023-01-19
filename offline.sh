#!/usr/bin/env bash 
ts-node .scripts/create-jsons.ts
ts-node .scripts/create-steps-sh.ts $1
chmod u+x ./steps.sh
./steps.sh
rm -rf state-machine.json
rm -rf functions.json
rm -rf ./steps.sh
