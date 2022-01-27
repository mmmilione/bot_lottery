const models = require("../../models/schemas");
const contracts = require('../../helpers/contracts');
const message = require('../../helpers/message');
const secrets = require('../../secrets');

const run = async () => {
    try {

        //Instantiate Contracts and Draw winner
        const allContracts = await contracts.init(secrets.masterSeed, 0);
        const options = {from: allContracts.accounts[0]};
        const pickWinner = await allContracts.Lottery
                                        .instance
                                        .methods
                                        .drawWinner()
                                        .send(options);

        //Parse EVT Data
        const evtData = pickWinner.events.newWinner.returnValues;
        const winnerPrize = allContracts.web3.utils.fromWei(evtData.winnerPrize, "ether");
        const dealerPrize = allContracts.web3.utils.fromWei(evtData.dealerPrize, "ether");

        //Inform User that ticket was purchased
        const money = "\u{1F4B0}";
        const ticket = "\u{1F3AB}";
        const finger = "\u{1F447}";
        const check = "\u{2705}";

        //Prepare notification messages
        const winnerMSG = `
${check} El Ganador de la rifa es el Ticket # ${evtData.luckyNumber}.\n\n
${money} El premio de ${winnerPrize} USDT ha sido enviado a la dirección:\n\n
${evtData.winningPlayer}\n\n`;

        const dealerMSG = `
${ticket} El Ticket ganador se vendio en este Canal.\n\n
${money} El admin del canal acaba de recibir ${dealerPrize} USDT a la dirección:\n\n
${evtData.winningDealer}\n\n`;

        const showHash = `
${finger} Hash de la transacción:\n\n\ 
${pickWinner.transactionHash}`; 

        //NOTIFICATIONS TO WINNERs 
        //Find all groups that partecipated in this edition
        const channels = [];
        const getNonce = await models.Nonces.findOne();
        const allTickets = await models.Tickets.find({edition: getNonce.edition});
        allTickets.forEach(item => {
            if(channels.indexOf(item.group) < 0){
                channels.push(item.group);
            }
        })

        //Fetch from mongo winning dealer
        const dealerQuery = {address: evtData.winningDealer.toLowerCase()};
        const winningDealerData = await models.Dealers.findOne(dealerQuery);
        const winningChannelID = winningDealerData.group;

        //Send appropriate notifications in each group
        channels.forEach(async(item) => {
            if(item == winningChannelID){
                const notificationText = winnerMSG + dealerMSG + showHash;
                await message.send(notificationText, item);
            }else{
                const notificationText = winnerMSG + showHash;
                await message.send(notificationText, item);
            }
        })

        //Update Lottery Edition
        const getEdition = await models.Nonces.findOne();
        const edition = getEdition.edition != null ? getEdition.edition : 0;
        const newEdition = edition + 1;
        const changes = {edition: newEdition};
        const editionOptions = {new: true};
        const updateEdition = await models.Nonces.findByIdAndUpdate(getEdition._id, changes, editionOptions);

    } catch (error) {
        console.log(error);
    }
}

exports.run = run;