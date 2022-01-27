const mongoose = require('mongoose');

const nonceSchema = new mongoose.Schema({
    nonce: {type: Number, required: true},
    edition: {type: Number, required: true},
});

exports.nonceSchema = nonceSchema;