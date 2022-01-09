const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    id: { type : Number, required: true },
    name : { type : String, required: true },
    password: { type : String , required: true },
    email: {type : String , required: true },
    phone: {type: String, required: true},
    type: {type: String, required: true}
}, { collection: 'users' });
const User = model('user', userSchema);
module.exports = User;