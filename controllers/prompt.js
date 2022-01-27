const models = require("../models/schemas");

const show = async (ctx) => {

    //Define Text and Buttons to be shown
    const finger = "\u{1F447}";
    const promptMSG = `Haga <b>click</b> en los ${finger}<b>botones abajo</b>${finger} para interactuar con el BOT de la rifa\n\n`;
    
    const secondRow = [
        {text: "Reglas de la Rifa", callback_data:"rules"}, 
        {text: "Premio Acumulado", callback_data:"stats"}, 
    ]

    //Is there a Dealer in this group?
    const query = {group: ctx.message.chat.id};
    const dealer = await models.Dealers.findOne(query);
    
    //If there is no dealer in the group, add the dealer BTN
    if(!dealer && ctx.from.isCreator == true){
        const dealerBTN = {text: "Ticket Reseller", callback_data:"dealer"};
        secondRow.push(dealerBTN);
    }

    ctx.telegram.sendMessage(ctx.message.chat.id, promptMSG, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{text: "Ticket", callback_data:"ticket"}],
                secondRow
            ]
        }
    });
    
}

exports.show = show;