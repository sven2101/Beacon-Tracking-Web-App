/**
 * Created by Andreas on 16.05.2015.
 */

'use strict';

angular.module('app', [
    'app.services',
    'app.beacons',
    'app.charts',
    'app.friends',
    'app.networks',
    'app.news',
    'app.settings',
    'app.welcome',
    'ngNewRouter',
    'ngResource'
])
    .controller('AppController', ['$router', AppController]);

function AppController($router) {
    $router.config([
        { path: "/beacons",             component: "beacons"      },
        { path: "/charts",              component: "charts"       },
        { path: "/friends",             component: "friends"      },
        { path: "/networks",            component: "networks"     },
        { path: "/news",                component: "news"         },
        { path: "/settings",            component: "settings"     },
        { path: "/",                    component: "welcome"      }
    ]);
}
