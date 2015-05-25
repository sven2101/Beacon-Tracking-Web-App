/**
 * Created by Andreas on 17.05.2015.
 */
'use strict';

angular.module('app.services', ['ngResource'])
    .factory('Networks', ['$resource',
        function($resource){
            return $resource('/networks', {}, {
                query: {method:'GET', isArray:true}
            });
    }])
    .factory('Users', ['$resource',
        function($resource){
            return $resource('/users', {}, {
                query: {method:'GET', isArray:true}
            });
    }]);