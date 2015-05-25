'use strict';

angular.module('app.news', ['ngResource'])
    .controller('NewsController', ['Me', function( Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

    }]);