const Lottery = require('../contracts/Lottery.json');
const contracts = require('../helpers/contracts');
const secrets = require('../secrets');

const send = async (ctx) => {
    const allContracts = await contracts.init(secrets.masterSeed, 0);
    const url = `https://bscscan.com/address/${Lottery.networks[allContracts.networkId].address}` 
    const check = "\u{2705}";
    const money = "\u{1F4B0}";
    const user = "\u{1F64E}";
    const ticket = "\u{1F3AB}";
    const bank = "\u{1F3E6}";
    const crown = "\u{1F451}";
    const time = "\u{1F567}";
    const see = "\u{1F440}";

    const msg =
`<b>REGLAS DE LA RIFA:</b>\n\n
${check} 1) Solo los usuarios ${user} que tengan el <b>ALIAS ACTIVO</b>pueden jugar.\n\n
${check} 2) El ticket ${ticket} de la rifa vale <b>3 USDT (BEP20)</b>. El ticket se paga enviando el monto requirido a la dirección que el BOT presente al jugador. Enviar el monto incorrecto equivale a perder el dinero.\n\n
${check} 3) El jugador tiene que especificar la <b>dirección</b> ${bank} donde quiere recibir el premio. Es responsabilidad del jugador insertar la dirección correcta.\n\n
${check} 4) En cada Grupo puede existir <b>solo un Ticket Reseller</b>${crown}.\n\n
${check} 5) El Ticket Reseller tiene que especificar la <b>dirección</b> ${bank} donde desea recibir sus comisiones. Solo el <b>CREADOR DEL GRUPO</b> puede hacer esta operacion. Es responsabilidad del Ticket Reseller asegurarse que la dirección sea correcta.\n\n
${check} 6) <b>El Ticket Reseller gana 0.5 USDT ${money} por cada ticket</b> comprado por los miembros de su Grupo.\n\n
${check} 7) El jugador que gana, recibe a su dirección el <b>90% del pozo.</b>${money}\n\n
${check} 8) El Ticket Reseller del grupo donde el ganador compro su ticket recibe el <b>10% del pozo</b>${money}\n\n
${check} 9) El ganador de la loteria es sorteado cada <b>Viernes a las 9.00 PM (hora de Buenos Aires)</b>${time}. El mecanismo de sorteo se hace por medio de un oracolo Chainlink que genera un numero 100% randomico.\n\n
${check} 10) El <b>Smart Contract</b> que hace funcionar la rifa <b>ES PUBLICO</b>${see}. Su dirección es la siguiente: <a href="${url}">${Lottery.networks[allContracts.networkId].address}</a>. Haga click en la direccion para revisar el Smart Contract`;
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, msg, {parse_mode: 'HTML'});
} 

exports.send = send;