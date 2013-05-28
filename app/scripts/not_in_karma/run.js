// Contents of this file are not to be included in the Karma config because it hurts testability.
cfpSpeakerApp.run(['$rootScope', '$cookies', '$location', 'UserService', 'EventService', 'EventBus', function ($rootScope, $cookies, $location, UserService, EventService, EventBus) {
    var userToken = $cookies.userToken;
    if (userToken && userToken.length > 0) {
        EventBus.onLoginSuccess($rootScope, function(user, userToken, event) {
            EventService.load();
//            $location.path('/');
        });
    }
}]);
