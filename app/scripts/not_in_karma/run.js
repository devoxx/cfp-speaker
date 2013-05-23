// Contents of this file are not to be included in the Karma config because the hurt testability.
angular.module('cfpSpeakerApp')
    .run(['$rootScope', 'UserService', 'EventService', function ($rootScope, UserService, EventService) {
        UserService.loginByToken();
        UserService.waitLoggedIn().then(function (data) {
            EventService.load();
        });
    }]);
