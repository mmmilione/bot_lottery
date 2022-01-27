const TronWeb = require("tronweb");
const hdWallet = require("tron-wallet-hd");
const utils=hdWallet.utils;
const secrets = require('../secrets');

const address = async (child) => {
    const account = await utils.getAccountAtIndex(secrets.seed, child);
    return account;
}

exports.address = address;