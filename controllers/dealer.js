const models = require("../models/schemas");
const contracts = require("../helpers/contracts");
const secrets = require("../secrets");


const help = (ctx) => {

    if(ctx.from.isCreator != true) {
        return ctx.reply("Solo el Creador del grupo puede crear el Ticket Reseller");
    }

    const finger = "\u{1F449}";
    const money = "\u{1F4B0}";
    const crown = "\u{1F451}";
    const rocket="\u{1F680}";
    const ticket = "\u{1F3AB}";
    const bank = "\u{1F3E6}";


const text = `Ser un <b>Tciket Reseller es muy ventajoso</b> ${money} por que te permite de monetizar tu grupo.\n\n
Los miembros del grupo van a poder usar este <b>BOT</b> sin salir de su Grupo y <b>Usted va a ganar comisiones</b> ${money} cada vez que alguien compre un ticket ${ticket} desde su grupo o gane el <b>POZO</b> ${money} despues de haber comprado un ticket.\n\n
Para ser un Ticket Reseller es suficiente ser el <b>CREADOR</b>${crown} del grupo Telegram donde el Bot opere.\n\n
${rocket} <b>Para empezar a ganar comisiones</b> ejecute el comando /nuevoReseller seguido por la <b>dirección de la billetera</b>${bank} BNB donde usted desea recibir sus comisiones.\n\n`

const example = `${finger} <b>Ejemplo:</b>\n\n/nuevoReseller 0x34A46D35BBAd2361c5418538ba21b765c4124EA1`;
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, text, {parse_mode: 'HTML'});
    ctx.telegram.sendMessage(ctx.chat.id, example, {parse_mode: 'HTML'});
}

const newDealer = async (ctx) => {

    const check = "\u{2705}";
    const errorEmoji = "\u{274C}";
    const finger = "\u{1F447}";
    const money = "\u{1F4B0}";

    try{
        if(ctx.from.isCreator != true) {
            const creatorError = `${errorEmoji}, Solo el <b>CREADOR</b> del Grupo puede ejecutar el comando para definir el Ticket Reseller`;
            return ctx.telegram.sendMessage(ctx.chat.id, creatorError, {parse_mode: 'HTML'});
        }

        //Get Text of the Message and make sure it contains a beneficiary address
        const text = ctx.message.text;
        if(!text.includes(' ')){
            const addressMissingError = `
@${ctx.message.from.username}\n\n
${errorEmoji} La Dirección de la Wallet <b>NO FUE ENVIADA</b>.\n\n
Envie el comando /nuevoReseller seguido por la dirección donde Usted desea recibir sus comisiones`;
            return ctx.telegram.sendMessage(ctx.chat.id, addressMissingError, {parse_mode: 'HTML'});
        }
        const address = text.split(' ')[1];

        //Deploy contracts, web3 and master address
        const allContracts = await contracts.init(secrets.masterSeed, 0);

        //Validate beneficiary Address
        const isAddress = await allContracts.web3.utils.isAddress(address);
        if(isAddress == false){
            const addressWrongError = `
@${ctx.message.from.username}\n\n
${errorEmoji} Dirección de la Wallet <b>INCORRECTA</b>.\n\n
Envie el comando /nuevoReseller seguido por la dirección donde Usted desea recibir sus comisiones`;
            return ctx.telegram.sendMessage(ctx.chat.id, addressWrongError, {parse_mode: 'HTML'});
        }
        
        //Make sure this new dealer is eligible
        const dealerQuery = { group: ctx.message.chat.id };
        const findDealer = await models.Dealers.findOne(dealerQuery);
        if(findDealer){
            const alreadyExistError = `
@${ctx.message.from.username}\n\n
${errorEmoji} En Este Grupo <b>YA EXISTE</b> un Ticket Reseller.\n\n`;
            
        return ctx.telegram.sendMessage(ctx.chat.id, alreadyExistError, {parse_mode: 'HTML'});
}
        
        //Save new Dealer into DB
        const newDealer = {
            address: address.toLowerCase(),
            group: ctx.message.chat.id,
            groupName: ctx.chat.title ? ctx.chat.title : "N.D.",
            owner: ctx.message.from.username
        }

        await models.Dealers(newDealer).save();

        const success = `
@${ctx.message.from.username}\n\n
${check} <b>Listo!</b>\n\n
Desde este momento Usted va a <b>ganar comisiones</b> ${money} que serán enviadas en automatico a esta dirección:${finger}\n\n
${newDealer.address}`;

        return ctx.telegram.sendMessage(ctx.chat.id, success, {parse_mode: 'HTML'});

    }catch(error){
        console.log(error);
        ctx.reply("Error!");
    }
}

exports.help = help;
exports.newDealer = newDealer;