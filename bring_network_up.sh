#!/usr/bin/env bash

#clear content in the wallet/walletOrg1 and wallet/walletOrg2
rm -rf /root/kpr-workshop/fabric-application/wallet/walletOrg1/*
rm -rf /root/kpr-workshop/fabric-application/wallet/walletOrg2/*

# Bring down the network
/root/fabric-samples/fabric-samples/test-network/network.sh down
# Bring up the network
echo "===== network up with CA's with create channel======"

/root/fabric-samples/fabric-samples/test-network/network.sh up createChannel -ca

echo "===== Deploy the basic transfer asset cc javascript chaincode======"
/root/fabric-samples/fabric-samples/test-network/network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript