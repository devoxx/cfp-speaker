var adminModuleId = 'Admin',
    adminUrlPrefix = '/admin',
    adminViewPrefix = 'views/admin',
    adminCtrlPrefix = adminModuleId  + '_',
    adminModule = angular.module(adminModuleId, []);

adminModule.value('appName', 'CFP Admin Module');

adminModule.config(function($routeProvider) {
    console.log('module admin config')
    // Admin routing
    $routeProvider
        .when(adminUrlPrefix, {
            templateUrl: adminViewPrefix + '/home.html',
            controller: adminCtrlPrefix + 'HomeCtrl'
        }).when(adminUrlPrefix + '/create_event', {
            templateUrl: adminViewPrefix + '/create_event.html',
            controller: adminCtrlPrefix + 'MyTalksCtrl'
        }).when(adminUrlPrefix + '/events', {
            templateUrl: adminViewPrefix + '/events.html',
            controller: adminCtrlPrefix + 'EventsCtrl'
        }).when(adminUrlPrefix + '/events/:event_id', {
            templateUrl: adminViewPrefix + '/event_details.html',
            controller: adminCtrlPrefix + 'EventDetailsCtrl'
        });
});

adminModule.controller(adminCtrlPrefix + 'HomeCtrl', function($scope) {

});

adminModule.controller(adminCtrlPrefix + 'CreateEventCtrl', function($scope) {

});

adminModule.controller(adminCtrlPrefix + 'EventDetailsCtrl', function($scope) {

});

adminModule.controller(adminCtrlPrefix + 'EventsCtrl', function($scope) {

});

