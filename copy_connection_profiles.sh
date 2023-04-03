#!/usr/bin/env bash

# Copy connection profiles to the correct location
echo "===== Creating Folder ======"
sudo mkdir -p /root/kpr-workshop/fabric-application/connection-profiles
# copy for Org1
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml /root/kpr-workshop/fabric-application/connection-profiles/connection-org1.yaml 
#copy for Org2
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml /root/kpr-workshop/fabric-application/connection-profiles/connection-org2.yaml 

# copy for Org1
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json /root/kpr-workshop/fabric-application/connection-profiles/connection-org1.json 
#copy for Org2
sudo cp -rf /root/fabric-samples/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json /root/kpr-workshop/fabric-application/connection-profiles/connection-org2.json 
echo "===== Connection Profiles Copied successfully ======"