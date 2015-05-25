'use strict';

angular.module('app.friends', ['ngResource'])
    .factory('Friends', ['$resource',
        function($resource){
            return $resource('/friends', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .controller('FriendsController', ['Friends', 'Me', function(Friends, Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

        this.friends = Friends.query();
        console.log("Friends: ", Friends.query());

    }]);