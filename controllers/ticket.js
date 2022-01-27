const IPFS = require("ipfs-api");
const fs = require('fs');
const path = require('path');
const qrcode = require("qrcode");
const models = require("../models/schemas");
const bnb = require("../helpers/bnb");
const contracts = require('../helpers/contracts'); 
const secrets = require('../secrets');

const buy = async (ctx) => {
    
    try{
        
        //Emojis
        const money = "\u{1F4B0}";
        const time = "\u{1F567}";
        const finger = "\u{1F447}";
        const ticketEmo = "\u{1F3AB}";
        const errorEmoji = "\u{274C}";

        //Make sure the user has an alias
        if(!ctx.message.from.username || ctx.message.from.username == ''){
            const aliasError = `${errorEmoji} Solo los usuarios con el <b>ALIAS ACTIVO</b> pueden comprar los Tciket de la rifa`;
            return ctx.telegram.sendMessage(ctx.chat.id, aliasError, {parse_mode: 'HTML'});
        }
        //Get Text of the Message and make sure it contains a beneficiary address
        const text = ctx.message.text;
        
        if(!text.includes(' ')){
            const addressMissingError = `
@${ctx.message.from.username}\n\n
${errorEmoji} La Dirección de la Wallet <b>NO FUE ENVIADA</b>.\n\n
Envie el comando /ticket seguido por la dirección donde Usted desea recibir los premios`;
            return ctx.telegram.sendMessage(ctx.chat.id, addressMissingError, {parse_mode: 'HTML'});
        }
        
        const playerAddress = text.split(' ')[1];

        //Deploy contracts, web3 and master address
        const allContracts = await contracts.init(secrets.masterSeed, 0);

        //Validate beneficiary Address
        const isAddress = await allContracts.web3.utils.isAddress(playerAddress);
        
        if(isAddress == false){
            const addressWrongError = `
@${ctx.message.from.username}\n\n
${errorEmoji} Dirección de la Wallet <b>INCORRECTA</b>.\n\n
Envie el comando /ticket seguido por la dirección donde Usted desea recibir los premios`;

            return ctx.telegram.sendMessage(ctx.chat.id, addressWrongError, {parse_mode: 'HTML'});
        
        }
    
        //Form Address
        const getNonce = await models.Nonces.findOne();
        const address = await bnb.address(getNonce.nonce);

        //Save New Ticket
        const ticket = {
            address: address,
            nonce: getNonce.nonce,
            status: "Solicited",
            playerAddress: playerAddress,
            player: ctx.message.from.username ? ctx.message.from.username : "Anonymous User",
            edition: getNonce.edition,
            group: ctx.update.message.chat.id,
            groupName: ctx.chat.title ? ctx.chat.title : "N.D.",
            timestamp: new Date().getTime(),
            timestampPayment: 0
        }

        const newTicket = await models.Tickets(ticket).save();

        //Update Nonce
        const updates = {nonce: getNonce.nonce + 1};
        await models.Nonces.findByIdAndUpdate(getNonce._id, updates);

        //Make QR code
        const qrUrl = path.join(__dirname, "../qrs", `${address}.png`);
        await qrcode.toFile(qrUrl, address);
        
        //Upload QR to IPFS
        const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
        const qrBuffer = fs.readFileSync(qrUrl, Buffer)
        const qrHash = await ipfs.files.add(qrBuffer);

        //Send Response with Photo
        const url = `https://ipfs.infura.io/ipfs/${qrHash[0].hash}`;
        const caption = `
@${ticket.player},\n\n
Envie 3 USDt (BEP20) ${money} a esta dirección para comprar el ticket ${ticketEmo} de la rifa.\n\n
${finger} ${address}\n\n
Usted Tiene 10 minutos ${time} de tiempo para efectuar el pago.`;
        ctx.replyWithPhoto({url},{caption});
        ctx.reply(address);
        
    }catch(error){
        console.log(error);
        ctx.reply(`${errorEmoji} No Fue Posible Crear Una Dirección Para El Pago de su Ticket`);
    }
}

exports.buy=buy;