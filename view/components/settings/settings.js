'use strict';

angular.module('app.settings', ['ngResource'])
    .controller('SettingsController', ['Me', function(Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

    }]);