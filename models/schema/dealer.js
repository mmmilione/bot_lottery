const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
	address: {type: String, required: true},
    group: {type: Number, required: true},
    groupName: {type: String, required: true},
    owner: {type: String, required: true},
});

exports.dealerSchema = dealerSchema;