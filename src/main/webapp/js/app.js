'use strict';

var app = angular.module('cfpSpeakerApp', [ 'Speaker', 'GenericServices', 'ui.bootstrap' ], null);

app.config(function($routeProvider) {
    // General routing
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        }).when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        }).when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl'
        }).otherwise({
            redirectTo: '/'
        });
});
