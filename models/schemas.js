const mongoose = require('mongoose');

//All Data Schemas
const ticket = require('./schema/ticket');
const dealer = require('./schema/dealer');
const nonce = require('./schema/nonce');

//Models
const Tickets = mongoose.model('Tickets', ticket.ticketSchema);
const Dealers = mongoose.model('Dealers', dealer.dealerSchema);
const Nonces = mongoose.model('Nonces', nonce.nonceSchema);

//Exports
exports.Nonces = Nonces;
exports.Dealers = Dealers;
exports.Tickets = Tickets;

