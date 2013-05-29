'use strict';

var cfpSpeakerApp = angular.module('cfpSpeakerApp', [ 'GenericServices', 'Speaker', 'Config', 'ui.bootstrap' ]);

cfpSpeakerApp.config(function ($routeProvider) {
    console.log('generic config');
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
