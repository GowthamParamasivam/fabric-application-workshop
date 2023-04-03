#!/usr/bin/env bash

# declare network.sh path
declare -r network_sh_path="/root/fabric-samples/fabric-samples/test-network/network.sh"

#clear content in the wallet/walletOrg1 and wallet/walletOrg2
rm -rf /root/kpr-workshop/fabric-application/wallet/walletOrg1/*
rm -rf /root/kpr-workshop/fabric-application/wallet/walletOrg2/*

# Bring down the network
$network_sh_path down
# Bring up the network
echo "===== network up with CA's with create channel======"

$network_sh_path up createChannel -ca

echo "===== Deploy the basic transfer asset cc javascript chaincode======"
$network_sh_path deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript

echo "===== Deploy the basic transfer asset cc javascript chaincode completed======"

# Copy connection profiles to the correct location
echo "===== Creating Folder ======"
sudo mkdir -p /root/kpr-workshop/fabric-application/connection-profiles
# copy yaml for Org1
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml /root/kpr-workshop/fabric-application/connection-profiles/connection-org1.yaml 
#copy yaml for Org2
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml /root/kpr-workshop/fabric-application/connection-profiles/connection-org2.yaml 

# copy json for Org1
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json /root/kpr-workshop/fabric-application/connection-profiles/connection-org1.json 
#copy json for Org2
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json /root/kpr-workshop/fabric-application/connection-profiles/connection-org2.json 
echo "===== Connection Profiles Copied successfully ======"