/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MerchantsContract extends Contract {

    async merchantsExists(ctx, merchantsId) {
        const buffer = await ctx.stub.getState(merchantsId);
        return (!!buffer && buffer.length > 0);
    }

    async regesterMerchants(ctx, merchantsId,merchantaccountid,merchantsbalance) {
        const exists = await this.merchantsExists(ctx, merchantsId);
        if (exists) {
            throw new Error(`The merchants ${merchantsId} already exists`);
        }
        const  tokenspecification={ merchantaccountid:merchantaccountid,merchantsbalance:merchantsbalance}
        try{

        const buffer = Buffer.from(JSON.stringify(tokenspecification));
        const res=await ctx.stub.putState(merchantsId, buffer);
        return   {message:`succesfully registered the merchants with id ${merchantsId} and accountid=${merchantaccountid}`,reponse:res.toString()};
    }
catch(err){
    console.log(err);
    let error={errrormesage:err.toString()}
    return   error;
}
    }

    async readMerchants(ctx, merchantsId) {
        const exists = await this.merchantsExists(ctx, merchantsId);
        if (!exists) {
            throw new Error(`The merchants ${merchantsId} does not exist`);
        }
        const buffer = await ctx.stub.getState(merchantsId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMerchants(ctx, merchantsId, merchantsbalance) {
        const assetString = await ctx.stub.getState(merchantsId);
        const asset = JSON.parse(assetString);

        // const exists = await this.merchantsExists(ctx, merchantsId);
        // if (!exists) {
        //     throw new Error(`The merchants ${merchantsId} does not exist`);
        // }

        const newasset = {merchantaccountid:asset.merchantaccountid ,merchantsbalance: (parseInt(merchantsbalance)+parseInt(asset.merchantsbalance)).toString()};
        const buffer = Buffer.from(JSON.stringify(newasset));
        await ctx.stub.putState(merchantsId, buffer);
        return newasset;
    }

    async deleteMerchants(ctx, merchantsId) {
        const exists = await this.merchantsExists(ctx, merchantsId);
        if (!exists) {
            throw new Error(`The merchants ${merchantsId} does not exist`);
        }
        await ctx.stub.deleteState(merchantsId);
    }







async getAssetsByMerchantsCCOUNTID(ctx, merchantaccountid) {
    const queryString = {
        selector: {
            merchantaccountid: merchantaccountid
        }
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

    const assets = [];
    while (true) {
        const result = await iterator.next();
        if (result.value) {
            assets.push(JSON.parse(result.value.value.toString('utf8')));
            const data=JSON.parse(result.value.value.toString('utf8'))
            return  data.merchantsbalance
        }

        if (result.done) {
            await iterator.close();

          // return asset;
        }
    }

    // console.log('mydata ${assets}');
    // assets.map((asset) => {return asset;});
}


async updateAccountBalance(ctx, merchantsId, amountToAdd) {

    const accountBytes = await ctx.stub.getState(merchantsId);
    if (!accountBytes || accountBytes.length === 0) {
        throw new Error(`Account with name ${merchantsId} does not exist`);
    }

    const account = JSON.parse(accountBytes.toString());
    account.merchantsbalance += amountToAdd; // Add the amount to the current balance

    await ctx.stub.putState(key, Buffer.from(JSON.stringify(account)));
   // return {message:"balanceadded successfully"};
}
}

module.exports = MerchantsContract;
