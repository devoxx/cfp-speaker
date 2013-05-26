// Contents of this file are not to be included in the Karma config because it hurts testability.
cfpSpeakerApp.run(['$rootScope', '$cookies', '$window', 'UserService', 'EventService', 'EventBus', function ($rootScope, $cookies, $window, UserService, EventService, EventBus) {
    var userToken = $cookies.userToken;
    if (userToken && userToken.length > 0) {
        EventBus.onLoginSuccess($rootScope, function(user, userToken, event) {
            EventService.load();
            console.log('href = ', $window.location.href)
            if ($window.location.href.indexOf('/logged_out') != -1) {
                $window.location.href = '/index.html#/';
            } else {
                $window.location.refresh();
            }
        });

        UserService.loginByToken(userToken);
    }
}]);
