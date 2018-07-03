var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    password: String
});

module.exports = mongoose.model('User', User);
