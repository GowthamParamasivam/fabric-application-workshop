'use strict';

// process.env.HFC_LOGGING = '{"debug": "console"}';
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const Client = require('fabric-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./lib/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./lib/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'student5';
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
		const ccp = buildCCPOrg1();
		const wallet = await buildWallet(Wallets, walletPathOrg1);
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: 'arjun',
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

            // await contract.submitTransaction('InitLedger',aarav, 'Aarav','CSE', '20');

			// console.log('\n--> Submit Transaction: enrollStudent, function creates the student');
			// await contract.submitTransaction('enrollStudent',arjun, 'Arjun','CSE', '20');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: GetAllAssets, function that returns the particular student');
			// let result = await contract.evaluateTransaction('getStudent',arjun);
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);


			console.log('\n--> Submit Transaction: enrollStudent, function creates the student');
			await contract.submitTransaction('enrollStudent','Arjun','CSE', '20');
			console.log('*** Result: committed');

			console.log('\n--> Evaluate Transaction: GetAllAssets, function that returns the particular student');
			let result = await contract.evaluateTransaction('getStudent');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// await contract.submitTransaction('enrollCourse','CSE');
			// console.log('*** Result: committed');

			// let result1 = await contract.evaluateTransaction('getStudent');
			// console.log(`*** Result: ${prettyJSONString(result1.toString())}`);

			// await contract.submitTransaction('enrollStudent','Arjun','CSE', '20');
			// console.log('*** Result: committed');


			// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			// await contract.submitTransaction('InitLedger');
			// console.log('*** Result: committed');

			// // Let's try a query type operation (function).
			// // This will be sent to just one peer and the results will be shown.
			// console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			// let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}


main();