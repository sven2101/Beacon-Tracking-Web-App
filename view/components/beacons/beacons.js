'use strict';

angular.module('app.beacons', ['ngResource'])
    .factory('Beacons2', ['$resource',
      function($resource){
        return $resource('/beacons/andreas.foitzik', {}, {
          query: { method:'GET', isArray:true }
        });
      }])
    .controller('BeaconsController', ['Beacons2','Me', function(Beacons2, Me) {

        this.me = Me.query();
        console.log("Me: ", Me.query());

        this.beacons2 = Beacons2.query();
        console.log("Beacons: ", Beacons2.query());

    }]);
