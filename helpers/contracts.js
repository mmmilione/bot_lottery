const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const secrets = require('../secrets');
const Lottery = require('../contracts/Lottery.json');
const USDT = require('../contracts/USDT.json');

const init = async (seed, child) => {

    const contracts = {
        gasPrice: 0,
        accounts: [],
        web3: null,
        networkId: 97,
        Lottery: {
            instance: null
        },
        USDT: {
            instance: null
        }
    }

    const walletOptions = {
        mnemonic: seed,
        providerOrUrl: secrets.gateway,
        addressIndex: child
    }

    try{
        const provider = new HDWalletProvider(walletOptions);
        contracts.web3 = new Web3(provider);
        contracts.networkId = await contracts.web3.eth.net.getId();
        contracts.accounts = await contracts.web3.eth.getAccounts();
        const gasPrice = await contracts.web3.eth.getGasPrice();
        contracts.gasPrice = Number(contracts.web3.utils.fromWei(String(gasPrice), 'gwei'));
        contracts.USDT.instance = new contracts.web3.eth.Contract(USDT.abi, USDT.networks[contracts.networkId].address);
        contracts.Lottery.instance = new contracts.web3.eth.Contract(Lottery.abi, Lottery.networks[contracts.networkId].address);
        return contracts;
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}

exports.init = init;