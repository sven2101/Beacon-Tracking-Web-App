/**
 * Created by Andreas on 16.05.2015.
 */

// additional
var express = require('express');
var mongoose = require('mongoose');
// nodejs core
var path        = require('path');
var fs          = require('fs');
var bodyParser  = require('body-parser');
var jwt         = require("jsonwebtoken");

var app = express();
app.use(bodyParser.json());

// use middleware
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(path.join(__dirname, 'bower_components')));

fs.readdirSync(__dirname + '/models').forEach(function(filename){
    if( ~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

mongoose.connect('mongodb://localhost/betrance');

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    console.log("Request Header: ");
    console.log(req.headers["authorization"]);
    if (typeof bearerHeader !== 'undefined') {
        console.log("Request: ");
        console.log(req);
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

/* USER AUTHENTICATION START */
app.post('/authorization', function(req, res) {
    console.log("Login ------ ");
    console.log(req.body);

    mongoose.model('users').findOne({name: req.body.username, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});
/* USER AUTHENTICATION END */

/* USER REGISTRATION START */
app.post('/signin', function(req, res) {
    mongoose.model('users').findOne({username: req.body.email, email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {

                var User = mongoose.model('users');

                var user = new User({
                    username: req.body.username,
                    password :  req.body.password,
                    email : req.body.email
                });

                user.save(function (err, data) {
                    if (err) res.sendStatus(400);
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });

                    res.sendStatus(200);
                });

                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});
/* USER REGISTRATION END */

app.get('/me',  function(req, res) {

    mongoose.model('users').findOne({name: 'andreas.foitzik'}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json(user);
        }
    });
});

/* USER API START */
app.get("/users", function(req, res){
    mongoose.model('users').find({}, function (err, users) {
        res.json(users);
    });
});
app.get("/users/:id", function(req, res){
    mongoose.model('users').findById(req.params.id, function (err, users) {
        res.json(users);
    });
});
app.get("/users/:username", function(req, res){
    mongoose.model('users').find({username:req.params.username}, function (err, users) {
        res.json(users);
    });
});

app.get("/users/beacons", function(req, res){
    console.log("Search For: ", req.params.username)

    mongoose.model('users').find({name:'andreas.foitzik'}, function (err, users) {
        console.log("Networks: ", users.network);

        users.networks.forEach( function(network){
            console.log("Netzwerk: ", network.name);
        })

    });
    res.json({ name:'test'})
});

app.post("/users", function(req, res){
    var User = mongoose.model('users');

    var user = new User({
        username: req.body.username,
        password :  req.body.password,
        email : req.body.email
    });

    user.save(function (err, data) {
        if (err) res.sendStatus(400);
        res.sendStatus(200);
    });
});

app.put('/users/:id', function(req, res){

    mongoose.model('users').findOne({_id: req.params.id}, function (err, user) {

        user.name =  req.body.username;
        user.telefonnummer =  req.body.password;
        user.email = req.body.email;

        user.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.put('/users/:username', function(req, res){

    mongoose.model('users').findOne({username: req.params.username}, function (err, user) {

        user.name =  req.body.username;
        user.telefonnummer =  req.body.password;
        user.email = req.body.email;

        user.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.delete("/users/:id", function(req,res){
    mongoose.model('users').remove({ _id: req.params.id }, function(err, user) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});

app.delete("/users/:username", function(req,res){
    mongoose.model('users').remove({ username: req.params.username }, function(err, user) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});
/* USER API END */

/* NETWORK API START */
app.get("/networks", function(req, res){
    mongoose.model('networks').find({}, function (err, networks) {
        res.json(networks);
    });
});
app.get("/networks/:username", function(req, res){
    var my_networks = [];

    mongoose.model('users').findOne({ name: req.params.username }, function (err, networks) {

        networks.networks.forEach(function(entry){
            mongoose.model('networks').find({name:entry.network}, function (err, networks) {
                console.log("Network: ", my_networks);
                my_networks = my_networks.concat(networks);
            });
        });
    });

    setTimeout(function(){
        console.log("Done: ", my_networks);
        res.json(my_networks);
    }, 300);

});

app.post("/networks/:username", function(req, res){
    console.log("Network");
    console.log("Network", req.body.name);

    mongoose.model('users').findOne({ name: req.params.username }, function (err, users) {
        users.networks.push({ network: req.body.name});
        console.log("Neu: ", users.networks);

        users.save(function (err, data) {
            if (err) res.sendStatus(400);
            res.sendStatus(200);
        });

    });

});

/*
app.get("/networks/:id", function(req, res){
    mongoose.model('networks').findById(req.params.id, function (err, network) {
        res.json(network);
    });
});
app.get("/networks/:name", function(req, res){
    mongoose.model('users').find({name:req.params.name}, function (err, network) {
        res.json(network);
    });
});
*/
app.post("/networks", function(req, res){
    var Network = mongoose.model('networks');

    var network = new Network({
        name: req.body.name,
        description :  req.body.description,
        becons : {}
    });

    network.save(function (err, data) {
        if (err) res.sendStatus(400);;
        res.sendStatus(200);
    });
});

app.put('/networks/:id', function(req, res){

    mongoose.model('networks').findOne({_id: req.params.id}, function (err, network) {

        network.name =  req.body.name;
        network.description =  req.body.description;
        network.beacons = req.body.beacons;

        network.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.put('/network/:name', function(req, res){

    mongoose.model('networks').findOne({name: req.params.name}, function (err, network) {

        network.name =  req.body.name;
        network.descprition =  req.body.description;
        network.beacons = req.body.beacons;

        network.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.delete("/networks/:id", function(req,res){
    mongoose.model('networks').remove({ _id: req.params.id }, function(err, network) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});

app.delete("/networks/:name", function(req,res){
    mongoose.model('networks').remove({ name: req.params.name }, function(err, network) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});
/* NETWORK API END */


/* BEACON API START */
app.get("/beacons", function(req, res){
    console.log("please work");
    mongoose.model('beacons').find({}, function (err, beacons) {
        res.json(beacons);
    });
});
app.get("/beacons/:username", function(req, res){
    mongoose.model('users').findOne({name: req.params.username}, function (err, user) {
        var usersBeacons = [];
        user.networks.forEach(function(entry, callback){
            mongoose.model('beacons').find({network: entry.network}, function (err, beacons) {
                usersBeacons = usersBeacons.concat(beacons);
                console.log(usersBeacons);
            });
        }, function (err) {
            if (err) { throw err; }
            console.log('Well done :-)!');
        });
        console.log("Timeout start");
        setTimeout(function(){
            res.json(usersBeacons);
        }, 100);
        console.log("Timeout end");
    });
});
app.get("/beacons/:id", function(req, res){
    mongoose.model('beacons').findById(req.params.id, function (err, beacon) {
        res.json(beacon);
    });
});
app.get("/beacons/:name", function(req, res){
    mongoose.model('users').find({name:req.params.name}, function (err, beacons) {
        res.json(users);
    });
});
app.get("/networks/:id/beacons", function(req, res){
    mongoose.model('beacons').find({network: req.params.id}, function (err, beacons) {
        res.json(beacons);
    });
});

app.post("/beacons", function(req, res){
    var Beacon = mongoose.model('beacons');

    var beacon = new Beacon({
        name: req.body.name,
        description :  req.body.description,
        network : req.body.network
    });

    beacon.save(function (err, data) {
        if (err) res.sendStatus(400);;
        res.sendStatus(200);
    });
});

app.put('/beacons/:id', function(req, res){

    mongoose.model('beacons').findOne({_id: req.params.id}, function (err, beacon) {

        beacon.name =  req.body.name;
        beacon.description =  req.body.description;
        beacon.network = req.body.network;

        beacon.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.put('/beacons/:name', function(req, res){

    mongoose.model('beacons').findOne({name: req.params.name}, function (err, beacon) {

        beacon.name =  req.body.name;
        beacon.description =  req.body.description;
        beacon.network = req.body.network;

        beacon.save(function (err, data) {
            if (err) res.sendStatus(200);
            res.sendStatus(200);
        });
    });
});

app.delete("/beacons/:id", function(req,res){
    mongoose.model('beacons').remove({ _id: req.params.id }, function(err, beacon) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});

app.delete("/beacons/:name", function(req,res){
    mongoose.model('beacons').remove({ name: req.params.name }, function(err, beacon) {
        if (err)  res.send(err);
        res.sendStatus(200);
    });
});
/* BEACON API END */

/* Friends API START */
app.get("/friends", function(req, res){
    mongoose.model('users').find({}, function (err, users) {
        res.json(users);
    });
});
/* Friends API END*/

// start the server
app.listen(80, function() {
    console.log('betrance ready on port 80');
});
