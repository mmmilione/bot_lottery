const models = require('../../models/schemas');
const contracts = require("../../helpers/contracts");
const message = require('../../helpers/message');
const time = require('../../helpers/time');
const Lottery = require('../../contracts/Lottery.json');
const secrets = require("../../secrets");

const run = async () => {
    
    try{

        let totalGas = 0;

        const query = {
            status: "Solicited",
            timestamp: {$gt: time.tenAgo()}
        }

        const solicitedTickets = await models.Tickets.find(query);

        if(solicitedTickets.length == 0) return;

        //Instantiate web3 and contracts
        const allContracts = await contracts.init(secrets.masterSeed, 0);

        //Loop through Solicited Tickets
        for(let i = 0; i < solicitedTickets.length; i++){

            //Make sure the ticket was paid
            let balanceUSDT = await allContracts.USDT.instance.methods.balanceOf(solicitedTickets[i].address).call();
            balanceUSDT = allContracts.web3.utils.fromWei(balanceUSDT , 'ether');
            
            if(balanceUSDT != 3) continue;
            
            //If the ticket was paid, move funds
            console.log("Ticket Pago!");
            const senderOptions = {from: allContracts.accounts[0]};

            //Dealer Data
            const dealerQuery = {group: solicitedTickets[i].group};
            const dealer = await models.Dealers.findOne(dealerQuery);
            if(!dealer) continue;
            const dealerAddress = dealer.address;
            
            //Send money to vault
            const prize = allContracts.web3.utils.toWei(String(1.5), "ether");
            
            const fundVault = await allContracts.USDT.instance
                                                    .methods
                                                    .transfer(
                                                        Lottery.networks[allContracts.networkId].address, 
                                                        prize)
                                                    .send(senderOptions);

            
            //Add to gas total
            totalGas += fundVault.gasUsed;

            //Fund Account to recover USDT
            const gas = fundVault.gasUsed * (allContracts.gasPrice + 1);
            const feeFounding = allContracts.web3.utils.toWei(String(gas) , 'gwei');
                                                
            //Update Lottery Contract
            senderOptions.value = feeFounding;
            const insertTicket = await allContracts.Lottery.instance
                                                            .methods
                                                            .registerTicket(
                                                                solicitedTickets[i].playerAddress,
                                                                dealerAddress,
                                                                solicitedTickets[i].address
                                                            )
                                                            .send(senderOptions);
            
            
            //Get ticket serial number
            const ticketSerialNumber = insertTicket.events.ticketCreated.returnValues.ticketSerialNumber;
            
            //Get ticket serial number
            const ticketCreationHash = insertTicket.transactionHash;
            
            //Update GAS
            totalGas += insertTicket.gasUsed;
            
            //Show gas in BNB
            const gasTotalCost = totalGas * allContracts.gasPrice;
            const gasTotalCostInWei = allContracts.web3.utils.toWei(String(gasTotalCost) , 'gwei');
            const gasTotalCostInBNB = allContracts.web3.utils.fromWei(String(gasTotalCostInWei) , 'ether');
            
            //Add Refund too
            const feeFoundingInBNB = allContracts.web3.utils.fromWei(String(feeFounding), 'ether')
            const superTotalCost = Number(gasTotalCostInBNB) + Number(feeFoundingInBNB);
            console.log("SUPER TOTAL WASTE: ", superTotalCost);

            //Update ticket status to Paid
            const changes = {
                status: "Paid", 
                timestampPayment: new Date().getTime()
            };

            await models.Tickets.findByIdAndUpdate(solicitedTickets[i]._id, changes);

            //Inform User that ticket was purchased
            const money = "\u{1F4B0}";
            const ticket = "\u{1F3AB}";
            const finger = "\u{1F447}";
            const check = "\u{2705}";

            const msg = `
${check} Felicidades @${solicitedTickets[i].player}!\n\n
Usted acaba de comprar el ${ticket} ticket # ${ticketSerialNumber}.\n\n
En caso de victoria, va a recibir el premio ${money} a la dirección:\n\n
${solicitedTickets[i].playerAddress}.\n\n
${finger} Abajo encuentra el hash de la transacción que registra su ticket en el Smart Contract:\n\n
${ticketCreationHash}`

            message.send(msg, solicitedTickets[i].group);
        }
        
    }catch(error){
        return console.log(error);
    }
    
}

exports.run = run;
