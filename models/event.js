const { Schema, model } = require('mongoose');
const eventSchema = new Schema({
    id: {type : Number, required: true },
    name: {type : String, required: true },
    location: {type : String, required: true },
    time: {type : Date, required: true },
    description: {type : String},
    government: {type : String},
    numberofparticipants: {type:Number},
    status: {type : String, required: true},
    creator: {type:Number , required: true}
}, { collection: 'events' });
const Event = model('event', eventSchema);
module.exports = Event;