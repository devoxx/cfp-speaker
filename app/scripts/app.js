'use strict';

angular.module('cfpSpeakerApp', [ 'GenericServices', 'Speaker', 'Config', 'ui.bootstrap' ])
  .config(function ($routeProvider) {
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
      }).otherwise({
        redirectTo: '/'
      });
  });
