'use strict';

angular.module('app.charts', ['ngResource'])
    .controller('ChartsController', ['Me', function(Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

    }]);