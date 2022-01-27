const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	address: {type: String, required: true},
    nonce: {type: Number, required: true},
    group: {type: Number, required: true},
    groupName: {type: String, required: true},
    playerAddress: {type: String, required: true},
    player: {type: String, required: true},
    edition: {type: Number, required: true},
    status: {type: String, required: true},
    timestamp: {type: Number, required: true},
    timestampPayment: {type: Number, required: true}
});

exports.ticketSchema = ticketSchema;