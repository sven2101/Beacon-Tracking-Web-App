/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: String,
    email: String,
    password: String,
    networks: []

});

module.exports = mongoose.model('users', usersSchema);