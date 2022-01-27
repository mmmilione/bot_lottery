const xchange = require('../../helpers/xchange');
const contracts = require("../../helpers/contracts");
const secrets = require("../../secrets");

//Reset Price
const reset = async () => {
    try {
        
        //Calculate Ticket Price in BNB (equivalent to 2 usd)
        const newPrice = await xchange.getTicketPrice();
        
        //Instantiate contract, accounts and web3 and call Lottery to change price
        const allContracts = await contracts.init(secrets.masterSeed, 0);
        const txOptions = {from: allContracts.accounts[0]};
        const newPriceInWei = allContracts.web3.utils.toWei(String(newPrice), 'ether');
        await allContracts.Lottery.instance.methods
                                            .changeprice(newPriceInWei)
                                            .send(txOptions);
                                            
        const priceInContract = await allContracts.Lottery.instance.methods.price().call();
    } catch (error) {
        return console.log(error);
    }
}

exports.reset = reset;