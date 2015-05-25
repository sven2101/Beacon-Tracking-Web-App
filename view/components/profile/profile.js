'use strict';

angular.module('app.profile', ['ngResource'])
    .controller('ProfileController', ['Friends', 'Me', function(Friends, Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

        this.friends = Friends.query();
        console.log("Friends: ", Friends.query());

    }]);