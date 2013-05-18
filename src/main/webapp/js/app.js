'use strict';

// var app = angular.module('DevoxxCfpApp', [ 'Speaker', 'Generic Services', 'ui.bootstrap', '$strap.directives' ], null);
var app = angular.module('cfpSpeakerApp', [ 'Speaker', 'GenericServices' ], null);

app.config(function($routeProvider) {
    console.log('generic config')
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

app.run(['$rootScope', 'UserService', 'EventService', function ($rootScope, UserService, EventService) {
    UserService.loginByToken();
    UserService.waitLoggedIn().then(function(){
        EventService.load();
    })
}]);
