const { Schema, model } = require('mongoose');
const connectionSchema = new Schema({
    eventId : { type : Number, required: true },
    userId: { type : Number, required: true }
}, { collection: 'connections' });
const Connection = model('connection', connectionSchema);
module.exports = Connection;