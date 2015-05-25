'use strict';

angular.module('app.networks', ['ngResource'])
    .factory('All_Networks', ['$resource',
        function($resource){
            return $resource('/networks', {}, {
                query: {method:'GET', isArray:true}
            });
    }])
    .factory('My_Networks', ['$resource',
        function($resource){
            return $resource('/networks/andreas.foitzik', {}, {
                query:  {method:'GET', isArray:true},
                save:   {method:'POST'}
            });
    }])
    .controller('NetworksController', ['All_Networks','My_Networks','Me', NetworksController]);

function NetworksController(All_Networks, My_Networks, Me) {


    this.me = Me.query();
    console.log("Me: ", Me.query());

    this.my_Networks = My_Networks.query();
    console.log("Networks: ", this.my_Networks);

    this.all_Networks = All_Networks.query();
    console.log("Networks: ", this.all_Networks);

    /*
    this.other_Networks = [];

    this.my_Networks.forEach(function(my_Networks_entry){
        this.all_Networks.forEach(function(all_Networks_entry){
            if(all_Networks_entry.name === my_Networks_entry.name){
                all_Networks_entry = null;
            }
        });
    });

    this.other_Networks = this.all_Networks;
    */
    this.add = function(network){
        console.log("Netzwerk: ", network);
        My_Networks.save(network);

        this.my_Networks = My_Networks.query();
        this.all_Networks = All_Networks.query();
    };
}