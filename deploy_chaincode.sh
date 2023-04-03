#!/usr/bin/env bash

#declare network.sh path
declare -r network_sh_path="/root/fabric-samples/fabric-samples/test-network/network.sh"
#declare chaincode path
declare -r chaincode_path="/root/kpr-workshop/fabric-application/studentfaculty-javascript"
#deckare chaincode name
declare -r chaincode_name="student"

echo "===== Deploying student Faculty Chaincode======"
$network_sh_path deployCC -ccn $chaincode_name -ccp $chaincode_path -ccl javascript
echo "===== Deploying student Faculty Chaincode completed======"