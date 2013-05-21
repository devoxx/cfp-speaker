'use strict';

angular.module('cfpSpeakerApp', [ 'GenericServices', 'Speaker', 'Config' ])
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
  }).run(['$rootScope', 'UserService', 'EventService', function ($rootScope, UserService, EventService) {
    // TODO this needs to be triggered probably somewhere else so it doesn't get triggered during unit tests  FIXME
    //UserService.loginByToken();
    //UserService.waitLoggedIn().then(function () {
    //  EventService.load();
    //});
  }]);
