const fetch = require('node-fetch');
const secrets = require('../secrets');

const send = async (msg, chatID) => {
    const text = encodeURIComponent(msg);
    const url = `https://api.telegram.org/bot${secrets.telegram_token}/sendMessage?chat_id=${chatID}&text=${text}`;
    const res = await fetch(url);
    if(res.status != 200) return console.log(`Error! ${res.status}`)
    return console.log("Fatto!");
}

exports.send = send;