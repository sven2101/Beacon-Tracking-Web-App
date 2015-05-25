/**
 * Created by Andreas on 30.04.2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var beaconsSchema = new Schema({
    name: String,
    description: String,
    network: String
});

module.export = mongoose.model('beacons', beaconsSchema);