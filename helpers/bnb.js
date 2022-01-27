const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const secrets = require('../secrets');

const address = async (child) => {
    
    const walletOptions = {
        mnemonic: secrets.seed,
        providerOrUrl: secrets.gateway,
        addressIndex: child
    }

    const provider = new HDWalletProvider(walletOptions);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
    
}

exports.address = address;