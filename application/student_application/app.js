//  create basic express app
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

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


//  create a post api to enroll a student in wallet, it should get the student name as input
app.post('/org1/registerstudent', async (req, res) => {

    const studentName = req.body.studentName;
    console.log(studentName);
    try {
        const ccp1 = buildCCPOrg1();
        const caClient1 = buildCAClient(FabricCAServices, ccp1, 'ca.org1.example.com');
        const wallet1 = await buildWallet(Wallets, walletPathOrg1);
        await registerAndEnrollUser(caClient1, wallet1, mspOrg1, studentName, 'org1.department1');
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        // return response with error
        res.status(400).send( { error: error } );
    }
    // return response with success with message studentname enrolled successfully
    res.status(200).send( { message: `${studentName} registered successfully and imported into wallet` } );
}
);


app.post('/org2/registerfaculty', async (req, res) => {

    const studentName = req.body.studentName;
    try {
        const ccp1 = buildCCPOrg2();
        const caClient1 = buildCAClient(FabricCAServices, ccp1, 'ca.org1.example.com');
        const wallet1 = await buildWallet(Wallets, walletPathOrg1);
        await registerAndEnrollUser(caClient1, wallet1, mspOrg1, studentName, 'org1.department1');
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        // return response with error
        res.status(400).send( { error: error } );
    }
    // return response with success with message studentname enrolled successfully
    res.status(200).send( { message: `${studentName} registered successfully and imported into wallet` } );
}
);


app.post('/org1/enrollstudent', async (req, res) => {

    const channelName = req.body.channelName;
    const chaincodeName = req.body.chaincodeName;
    const studentName = req.body.studentName;
    const department = req.body.department;
    const age = req.body.age;

    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPathOrg1);
    const gateway = new Gateway();
    try {
			await gateway.connect(ccp, {
				wallet,
				identity: studentName,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

            await contract.submitTransaction('enrollStudent',studentName,department,age);
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        // return response with error
        res.status(400).send( { error: error } );
    }
    // return response with success with message studentname enrolled successfully
    res.status(200).send( { message: `${studentName} enrolled successfully` } );
}
);

//PORT ENVIRONMENT VARIABLE
app.listen(port, () => console.log(`Listening on port ${port}..`));
