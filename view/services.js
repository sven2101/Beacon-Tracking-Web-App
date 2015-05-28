/**
 * Created by Andreas on 17.05.2015.
 */
'use strict';

angular.module('app.services', ['ngResource'])
    .service('Networks', ['$resource',
        function($resource){
            return $resource('/networks', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('Beacons', ['$resource',
        function($resource){
            return $resource('/beacons', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('Friends', ['$resource',
        function($resource){
            return $resource('/friends', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('News', ['$resource',
        function($resource){
            return $resource('/news', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('Beacons', ['$resource',
        function($resource){
            return $resource('/beacons', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('Settings', ['$resource',
        function($resource){
            return $resource('/settings', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('All_Networks', ['$resource',
        function($resource){
            return $resource('/networks', {}, {
                query: {method:'GET', isArray:true}
            });
        }])
    .service('My_Networks', ['$resource',
        function($resource){
            return $resource('/networks/andreas.foitzik', {}, {
                query:  {method:'GET', isArray:true},
                save:   {method:'POST'}
            });
        }])
    .service('Login', ['$resource',
        function($resource){
            return $resource('/authorization', {}, {
                save: {method:'POST'}
            });
        }])
    .service('Me', ['$resource',
        function($resource){
            return $resource('/me', {}, {
                query: { method:'GET'}
            });
        }])
    .service('Users', ['$resource',
        function($resource){
            return $resource('/users', {}, {
                query: {method:'GET', isArray:true}
            });
        }]);