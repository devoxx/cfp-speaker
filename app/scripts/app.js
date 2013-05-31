'use strict';

var cfpSpeakerApp = angular.module('cfpSpeakerApp', [ 'GenericServices', 'Speaker', 'ui.bootstrap' ]);

cfpSpeakerApp.config(function ($routeProvider) {
    // General routing
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        }).when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl'
        }).when('/lost_password', {
            templateUrl: 'views/lost_password.html',
            controller: 'LostPasswordCtrl'
        }).when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        }).when('/logged_out', {
            templateUrl: 'views/logged_out.html'
        }).when('/about', {
            templateUrl: 'views/about.html'
        }).when('/contact', {
            templateUrl: 'views/practical/contact.html'
        }).when('/faq', {
            templateUrl: 'views/practical/faq.html'
        }).when('/team', {
            templateUrl: 'views/practical/team.html'
        }).when('/venue', {
            templateUrl: 'views/practical/venue.html'
        }).otherwise({
            redirectTo: '/'
        });
});
