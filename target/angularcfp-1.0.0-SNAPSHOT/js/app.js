var app = angular.module('DevoxxCfpApp', ['Admin', 'PrgCmt', 'Speaker', 'Generic Services', 'ui.bootstrap', '$strap.directives'], null);

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
        }).when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        }).when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'ContactCtrl'
        }).otherwise({
            redirectTo: '/'
        });
});
