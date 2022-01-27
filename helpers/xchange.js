const fetch = require('node-fetch');

const getTicketPrice = async () => {
    try {
        const url = "https://apicripto.com/api/getExchangeRates";
        const res = await fetch(url);
        if(res.status != 200) throw new Error (`Error: (${res.status})`);
        const data = await res.json();
        const ticketPrice = Number((2 / data.BNB).toFixed(8));
        return ticketPrice;
    } catch (error) {
        throw new Error (error);
    }
}

exports.getTicketPrice = getTicketPrice;