const models = require('../models/schemas');
const contracts = require('../helpers/contracts'); 
const Lottery = require('../contracts/Lottery.json');
const secrets = require('../secrets');

const getStats = async (ctx) => {
    try {
        const money = "\u{1F4B0}";
        const ticket = "\u{1F3AB}";
        const edition = "\u{1F503}";
        const timeEmoji = "\u{1F567}";

        const nonces = await models.Nonces.findOne();
        const allContracts = await contracts.init(secrets.seed, 0);
        const ticketsSold = await allContracts.Lottery.instance
                                                        .methods
                                                        .countTickets()
                                                        .call();
        
        const usdtBalance = await allContracts.USDT.instance
                                                    .methods
                                                    .balanceOf(Lottery.networks[allContracts.networkId].address)
                                                    .call();
                                                
        const jackpot = await allContracts.Lottery.instance
                                                    .methods
                                                    .howMuchIsPrize(usdtBalance)
                                                    .call();

        const pozo = allContracts.web3.utils.fromWei(jackpot, "ether");
        const msg = `
<b>PREMIO ACUMULADO:</b>\n\n
${edition}Edición #: <b>${nonces.edition}</b>\n\n
${ticket}Tickets Vendidos: <b>${ticketsSold}</b>\n\n
${money}Premio para el ganador: <b>${pozo} USDT</b>\n\n
${timeEmoji}Sorteo: <b>cada Viernes a las 9.00 PM</b> (hora de Buenos Aires)\n\n`
        ctx.deleteMessage();
        ctx.telegram.sendMessage(ctx.chat.id, msg, {parse_mode: 'HTML'});

    } catch (error) {
        console.log(error);
        ctx.reply("Error! No Se Pudieron Obtener las Informaciones sobre la Rifa");
    }
}

exports.getStats = getStats;