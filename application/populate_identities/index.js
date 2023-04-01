const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./lib/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./lib/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const walletPathOrg1 = path.join(__dirname, '..','..','wallet','walletOrg1');
const walletPathOrg2 = path.join(__dirname, '..','..','wallet','walletOrg2');
// student aarav name
const aarav = 'aarav';
// student arjun name
const arjun = 'arjun';
// faculty rohit name
const rohit = 'rohit';
// faculty rajendra name
const rajendra = 'rajendra';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    try {
        const ccp1 = buildCCPOrg1();
        const caClient1 = buildCAClient(FabricCAServices, ccp1, 'ca.org1.example.com');
        const wallet1 = await buildWallet(Wallets, walletPathOrg1);
        await enrollAdmin(caClient1, wallet1, mspOrg1);
        await registerAndEnrollUser(caClient1, wallet1, mspOrg1, aarav, 'org1.department1');
        await registerAndEnrollUser(caClient1, wallet1, mspOrg1, arjun, 'org1.department1');

        const ccp2 = buildCCPOrg2();
        const caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');
        const wallet2 = await buildWallet(Wallets, walletPathOrg2);
        await enrollAdmin(caClient2, wallet2, mspOrg2);
        await registerAndEnrollUser(caClient2, wallet2, mspOrg2, rohit, 'org2.department1');
        await registerAndEnrollUser(caClient2, wallet2, mspOrg2, rajendra, 'org2.department1');

    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

main();