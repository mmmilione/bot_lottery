const models = require('../../models/schemas');
const contracts = require("../../helpers/contracts");
const time = require('../../helpers/time');
const secrets = require("../../secrets");

const run = async () => {
    
    try {

        const query = {
            status: "Paid",
            timestampPayment: {$gt: time.tenAgo()}
        }

        const paidTickets = await models.Tickets.find(query);

        if(paidTickets.length == 0) return;
        
        //Loop through Solicited Tickets
        for(let i = 0; i < paidTickets.length; i++){
                        
            //Instantiate web3 and contracts
            const allContracts = await contracts.init(secrets.seed, paidTickets[i].nonce);
            const options = {from: allContracts.accounts[0]};
            const refundAmount = allContracts.web3.utils.toWei("3", "ether");
            const refundMaster = await allContracts.USDT.instance
                                                        .methods
                                                        .transfer(secrets.owner, refundAmount)
                                                        .send(options);

            const changes = {status: "Processed"};
            await models.Tickets.findByIdAndUpdate(paidTickets[i]._id, changes);
        }

    } catch (error) {
        return console.log(error);
    }
}

exports.run = run;
