/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ErcTokenContract extends Contract {

    async ercTokenExists(ctx, ercTokenId) {
        const buffer = await ctx.stub.getState(ercTokenId);
        return (!!buffer && buffer.length > 0);
    }

    async createErcToken(ctx, ercTokenId,tokenuser,tokenvalue,tokenpurpose,takoenvalidity,merchantsid) {
        const exists = await this.ercTokenExists(ctx, ercTokenId);
        const  tokenspecification={ ercTokenId:ercTokenId,value: tokenvalue,purpose:tokenpurpose,validitydate:takoenvalidity,tokenuser:tokenuser,merchantsid:merchantsid


        };
        if (exists) {
            throw new Error(`The erc token ${ercTokenId} already exists`);
        }
        // const asset = { value };
        // const buffer = Buffer.from(JSON.stringify(asset));
try{
      let res=  await ctx.stub.putState(ercTokenId,Buffer.from(JSON.stringify(tokenspecification)));
        console.log(`The erc token ${ercTokenId} has been created with value ${tokenvalue} and purpose ${tokenpurpose} and validity date ${takoenvalidity}`);
        return   {message:`The erc token ${ercTokenId} has been created with value ${tokenvalue} and purpose ${tokenpurpose} and validity date ${takoenvalidity}`,reponse:res.toString()};
    }
catch(err){
    console.log(err);
    let error={errrormesage:err.toString()}
    return   error;
}

    }

    async readErcToken(ctx, ercTokenId) {
        const exists = await this.ercTokenExists(ctx, ercTokenId);
        if (!exists) {
            throw new Error(`The erc token ${ercTokenId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ercTokenId);

        const asset = JSON.parse(buffer.toString());
        console.log('mydata ${buffer.toString()}');
        return buffer.toString();
    }

    async updateErcToken(ctx, ercTokenId, newValue) {
        const exists = await this.ercTokenExists(ctx, ercTokenId);
        if (!exists) {
            throw new Error(`The erc token ${ercTokenId} does not exist`);
        }
        const asset = { tokenvalue: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ercTokenId, buffer);
    }
    async deleteErcToken(ctx, ercTokenId) {
        const exists = await this.ercTokenExists(ctx, ercTokenId);
        if (!exists) {
            throw new Error(`The erc token ${ercTokenId} does not exist`);
        }
        await ctx.stub.deleteState(ercTokenId);
    }

    async TransferErcToken(ctx, tokenuser,amount) {
        // const exists = await this.ercTokenExists(ctx, ercTokenId);
        // if (!exists) {
        //     throw new Error(`The erc token ${ercTokenId} does not exist`);
        // }
        // await ctx.stub.deleteState(ercTokenId);



        const queryString = {
            selector: {
                tokenuser: tokenuser
            }
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const assets = [];
        while (true) {
            const result = await iterator.next();
            if (result.value) {
                assets.push(JSON.parse(result.value.value.toString('utf8')));
                const data=JSON.parse(result.value.value.toString('utf8'))
               console.log(data.ercTokenId);
              // assets.push(data.ercTokenId)
               if (isBalanceGreater(data.value, amount)) {
                console.log("Balance is greater than or equal to the amount.");
               // assets.push("Balance is greater than or equal to the amount.")
                const newbalance=(parseFloat(data.value)-parseFloat(amount)).toFixed(2)
                const  tokenspecification={ ercTokenId:data.ercTokenId,value: newbalance,purpose:data.purpose,validitydate:data.validitydate,tokenuser:data.tokenuser,merchantsid:data.merchantsid


                };
                const buffer = Buffer.from(JSON.stringify( tokenspecification));
        await ctx.stub.putState(data.ercTokenId, buffer);
      // assets.push(tokenspecification)


              } else {
                console.log("Balance is less than the amount.");
              }

           //    assets.push()
            }

            if (result.done) {
                await iterator.close();

              return assets;
            }
        }

        // console.log('mydata ${assets}');
        // assets.map((asset) => {return asset;});
    }




    async getUserIDByUsername(ctx, tokenuser) {
        const userID = await ctx.stub.getState(`tokenuser:${tokenuser}`);

        if (!userID || userID.length === 0) {
            throw new Error(`User with userid ${tokenuser} does not exist`);
        }

        return userID.toString();
    }



}


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
module.exports = ErcTokenContract;
