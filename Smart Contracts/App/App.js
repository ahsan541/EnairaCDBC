
console.log("Ahsan Khan")
// Connect to a gateway peer


const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../Myservices/connectionprofile/CAUtil');
const { buildCCPOrg1, buildWallet } = require('../Myservices/connectionprofile/AppUtil');
console.log("Ahsan Khan at line 11 check")
const channelName = process.env.CHANNEL_NAME || 'channel1';
const chaincodeName = process.env.CHAINCODE_NAME || 'ERCtokensmartcontract';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'AhsanKhannewuseer01';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
console.log("Ahsan Khan at line 22 check")


async function main(erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants,res) {
	let response;
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
     await  createErctoken(contract,erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants,res)
            console.log('*** on line 68 done Result: committed on ledger with data');
		
			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			// //await contract.submitTransaction('InitLedger');
			// console.log('*** Result: committed');

			// Let's try a query type operation (function).
			// This will be sent to just one peer and the results will be shown.
			//console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			// let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			// console.log('\n--> Submit Transaction: CreateERC Tken, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			// result = await contract.submitTransaction('createErctoken', '002', 'Ahsan Khan', '5', 'Tom', '1300',"akk");
			// console.log('*** on line 86Result: committed on ledger with data 001');
			// if (`${result}` !== '') {
			// 	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			// }

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
			// result = await contract.evaluateTransaction('ReadAsset', 'a001');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			// result = await contract.evaluateTransaction('AssetExists', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			// await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// try {
			// 	// How about we try a transactions where the executing chaincode throws an error
			// 	// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
			// 	console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
			// 	await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
			// 	console.log('******** FAILED to return an error');
			// } catch (error) {
			// 	console.log(`*** Successfully caught the error: \n    ${error}`);
			// }

			// console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
			// await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
			// console.log('*** Result: committed');

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
			
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}

// Convert token to dollars 
async function Verifytoken(erctokenId,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
           
			result =await contract.submitTransaction("readErcToken", erctokenId);
			console.log('*** Result: committed');
			console.log('*** on line 180Result: committed on ledger with data'+erctokenId);
			res.send(result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
		gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		res.send(error);
		gateway.disconnect();
		//process.exit(1);
	}
}









// Createtoken
async function Createtoken(erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants
	    ,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
           
			result =await contract.submitTransaction('createErcToken', erctokenId, tokenuserid, tokenvalue, tokenpurpose, takoenvalidity,Specifiedmerchants);
			console.log('*** Result: committed');
			console.log('*** on line 248Result: committed on ledger with data'+erctokenId);
			res.send({Message:`${prettyJSONString(result.toString())}`}
			);
			if (`${result}` !== '') {
				//res.send(Result:`${prettyJSONString(result.toString())}` );
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
		gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		res.send(error );
		gateway.disconnect();
		//process.exit(1);
	}
}


const createErctoken=async (contract,erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants,res) =>{
   try{console.log('\n--> Submit Transaction: CreateERC Tken, creates new asset with ID,owner,value, validity, and specified merchants');
    result = await contract.submitTransaction('createErcToken', erctokenId, tokenuserid, tokenvalue, tokenpurpose, takoenvalidity,Specifiedmerchants);
    console.log('*** on line 205 committed on ledger with Token ID {'+tokenuserid+'}');
    if (`${result}` !== '') {
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		
		console.log(`*** on line 209 Result: data${prettyJSONString(result.toString())}`);
		await res.send({Result:`${prettyJSONString(result.toString())}`})
		console.log(`*** line 214 data send `);
    }}
	catch(err){
			console.log("error at 282"+err);
		}
}

///// Registered merchants

// Convert token to dollars 
async function registermerchants(merchantid,accountid,initialbalance,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract("merchantsmartcontract");
           
			result =await contract.submitTransaction("regesterMerchants", merchantid,accountid,initialbalance);
			console.log('*** Result: committed');
			console.log('*** on line 180Result: committed on ledger with data'+merchantid);
			res.send(result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
		gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		res.send(error);
		gateway.disconnect();
		//process.exit(1);
	}
}
////transfer token

// Convert token to dollars 
async function registermerchants(merchantid,amount,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract("merchantsmartcontract");
           
			result =await contract.submitTransaction("updateMerchants", merchantid,amount);
			console.log('*** Result: committed');
			console.log('*** on line 480Result: committed on ledger with data'+merchantid);
			res.send(result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			}
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
		gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		res.send(error);
		gateway.disconnect();
		//process.exit(1);
	}
} 
async function transferamounttomerchant(userid,amount,res) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();
        console.log("Ahsan Khan at line 30 check")
		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'org1ca-api.127-0-0-1.nip.io:8080');
        console.log("Ahsan Khan at line 34 check")
		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
           
			result =await contract.submitTransaction("TransferErcToken", userid,amount);
			console.log('*** Result: committed');
			console.log('*** on line 410Result: committed on ledger with data'+userid);
			myJSONarray = JSON.parse(result)
			//res.send(result );
			if (`${result}` !== '') {
			//	res.send(`*** Result: ${prettyJSONString(result.toString())}` );
				console.log(`*** Result line 415: ${prettyJSONString(result.toString())}`);
				const length=myJSONarray.length
				myJSONarray.forEach( async (item,index) => {



				   console.log("in foreach "+item.value)
				
				   if (isBalanceGreater(item.value, amount)) {
					console.log(" line 485 Balance is greater than or equal to the amount you can transfer the amount.");
				   // assets.push("Balance is greater than or equal to the amount.")
					const newbalance=(parseFloat(item.value)-parseFloat(amount)).toFixed(2)
					//const  tokenspecification={ ercTokenId:data.ercTokenId,value: newbalance,purpose:data.purpose,validitydate:data.validitydate,tokenuser:data.tokenuser,merchantsid:data.merchantsid
					await registermerchants(item.merchantsid,newbalance,res)
					console.log("490tranfered the amount successfully in merchants account id: "+item.merchantsid)
					}else {
						console.log("line 493 Balance is less than the amount you can tranfer");
					  }
				
				}
				   
				 
				 
				   )




			}
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
		gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		res.send(error);
		gateway.disconnect();
		//process.exit(1);
	}
}


 //connectotserver()
 const bodyParser = require('body-parser')
 console.log("connecting ahsan khan")
 const express = require('express')
 const App=express()
 App.use(bodyParser.json())
App.use(bodyParser.urlencoded({ extended: true}))
 
App.post('/createtoken', async (req, res) => {
    console.log("url hits")
    let tokenuserid = req.body.userid
  let erctokenId= req.body.Tokenid
    let tokenpurpose = req.body.tokenpurpose
	let tokenvalue = req.body.tokenvalue
  let takoenvalidity= req.body.tokenvalidity
  let Specifiedmerchants= req.body.specifiedmerchants

   // let {Tokenid,userid,tokenvalue,tokenpurpose,tokenvalidity,specifiedmerchants}=JSON.stringify(data)
  await  Createtoken(erctokenId,tokenuserid,tokenvalue,tokenpurpose,takoenvalidity, Specifiedmerchants,res);
   // res.send('Data Received:sucessfully  created Toke with id '+erctokenId);
 
 console.log("on line 305 completed and response send to app the transcation success fully  ")
})

App.post('/verifytoken', (req, res) => {
    console.log("verifytokenurl hitsurl hits")
    
  let erctokenId= req.body.Tokenid
  console.log("my token"+erctokenId); 
   
   // let {Tokenid,userid,tokenvalue,tokenpurpose,tokenvalidity,specifiedmerchants}=JSON.stringify(data)
  Verifytoken(erctokenId ,res);
  
   // console.log("completed the transcation success fully "+userid+" "+Tokenid+" "+tokenvalue+" "+tokenpurpose+" "+takoenvalidity+" "+Specifiedmerchants)
})


App.post('/registermerchants', (req, res) => {
    console.log("verifytokenurl hitsurl hits")
    
  let merchantsId= req.body.merchantsid
  let merchantsaccountId= req.body.merchantsaccountid
  let merchantsinitialbalance= req.body.initialbalance
  console.log("my merchantsid "+merchantsId); 
   
   // let {Tokenid,userid,tokenvalue,tokenpurpose,tokenvalidity,specifiedmerchants}=JSON.stringify(data)
  registermerchants(merchantsId,merchantsaccountId,merchantsinitialbalance ,res);
  
   // console.log("completed the transcation success fully "+userid+" "+Tokenid+" "+tokenvalue+" "+tokenpurpose+" "+takoenvalidity+" "+Specifiedmerchants)
})

App.post('/transfertoken', (req, res) => {
    console.log("transfertoken 495 url hits")
    
  let userid= req.body.userid
  let amount= req.body.amount
 
  console.log("userid "+userid); 
   
   // let {Tokenid,userid,tokenvalue,tokenpurpose,tokenvalidity,specifiedmerchants}=JSON.stringify(data)
   transferamounttomerchant(userid,amount ,res);
  
   // console.log("completed the transcation success fully "+userid+" "+Tokenid+" "+tokenvalue+" "+tokenpurpose+" "+takoenvalidity+" "+Specifiedmerchants)
})
 App.get('/', (req, res)=>{
 res.json({"success":true,"message":"successfully listinig "})

 })
 App.get('/test', (req, res)=>{
     res.json({"success":true,"message":"test succesfully listning the server of hyperledger Fabric "})
     console.log("url hits")
    // console.log(JSON.stringify(res.json))
     //main();
     })
	 App.get('/helloworld', (req, res)=>{
		res.json({"success":true,"message":"test succesfully listning "})
		console.log("url hits")
	  
		})
    //  App.get('/createtoken', (req, res)=>{
    //     res.json({"success":true,"message":"test succesfully listning create token  "})
    //     console.log("url hits create token")
    //     var email = res.data() 
    //     console.log(JSON.stringify(email))
    //     //main();
    //     })
 App.listen(9000,()=>{
     console.log("listening on 9000")
 })



 function isBalanceGreater(balance, amount) {
	// Convert string values to numerical values (floats)
	const balanceNum = parseFloat(balance);
	const amountNum = parseFloat(amount);
  
	// Check if balance is greater than amount
	if (isNaN(balanceNum) || isNaN(amountNum)) {
	  throw new Error('Invalid input. Please provide valid numeric strings.');
	}
  
	return balanceNum >= amountNum;
  }