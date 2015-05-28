'use strict';

angular.module('app.welcome', ['ngResource'])
    .controller('WelcomeController', ['Users', 'Me', 'Login', '$location', function(Users, Me, Login, $location) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

        this.login = function(){
            Login.save({username:'andreas.foitzik', password:'root'}, function(res) {
                console.log("Response");
                console.log(res);

                $location.path('/news');

                }, function(error) {
                    // Error handler code
                    console.log("Response");
                    console.log(res);
                });
        };

        this.signup = function(){
            console.log("Username: ", this.req_username);
            console.log("Email: ", this.req_email);
            console.log("Password: ", this.req_password);
        };

    }]);

