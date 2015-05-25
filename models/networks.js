/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var networksSchema = Schema({
    name: String,
    description: String,
    img: String,
    beacons: Array
});

module.export = mongoose.model('networks', networksSchema);