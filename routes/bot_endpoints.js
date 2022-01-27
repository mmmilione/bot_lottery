const {Telegraf} = require("telegraf");
const prompt = require("../controllers/prompt");
const ticket = require("../controllers/ticket");
const dealer = require("../controllers/dealer");
const stats = require("../controllers/stats");
const rules = require("../controllers/rules");

const secrets = require('../secrets');

const bot_init = async () => {
    
    console.log("Bot is Going live");
    const bot = new Telegraf(secrets.telegram_token);
    
    bot.use(async(ctx, next) => {
        try{
            if( ctx.chat.id > 0 ) return next();
            const admins = await bot.telegram.getChatAdministrators(ctx.chat.id);
            if(!admins || admins.length < 1) next();
            const creator = admins.filter(adm => adm.status === "creator")[0];
            ctx.from.isCreator = creator.user.id === ctx.from.id ? true : false;
            console.log("Is he the CREATOR?", ctx.from.isCreator);
            next(ctx);
        }catch(error){
            console.log(error);
            next();
        }
    });

    bot.command(["rifa", "RIFA", "Rifa"], (ctx) => prompt.show(ctx));
    bot.command(["ticket", "TICKET", "Ticket"], (ctx) => ticket.buy(ctx));
    bot.command("nuevoReseller", (ctx) => dealer.newDealer(ctx));

    bot.action("ticket", ctx => {
        const finger = "\u{1F449}";
        const msg = `
<b>COMO COMPRAR UN TICKET:</b>\n\n
tipear el comando / ticket seguido por la dirección donde Usted deasea recibir el premio en el caso que gane el pozo.\n\n
${finger}<b>Ejemplo:</b>\n\n
/ticket 0x9fB668620370F00Eb0F3fa0cE0dBddcdB479cebB`;

        ctx.deleteMessage();
        ctx.telegram.sendMessage(ctx.chat.id, msg, {parse_mode: 'HTML'})
    });
    
    bot.action("rules", ctx => rules.send(ctx));

    bot.action("dealer", ctx => dealer.help(ctx));

    bot.action("stats", ctx => stats.getStats(ctx));

    bot.launch();
    
    return bot;
}

exports.bot_init = bot_init;

