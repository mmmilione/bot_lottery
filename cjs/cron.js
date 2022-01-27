const cron = require('node-cron');
const check = require('./tasks/check');
const register = require('./tasks/register');
const winner = require('./tasks/winner');

module.exports = (bot) => {

    //Check Ticket Payments
    cron.schedule('* * * * *', check.run);
    //Register Ticket
    cron.schedule('* * * * *', register.run);
    //Register Ticket
    cron.schedule('0 21 * * Fri', () => winner.run(), {timezone: "America/Argentina/Buenos_Aires"});

    //Test Buenos Aires Time
    //cron.schedule('5 10 * * Tue', () => console.log("Ora in Argentina"), {timezone: "America/Argentina/Buenos_Aires"});
    //cron.schedule('* * * * *', price.reset);

}