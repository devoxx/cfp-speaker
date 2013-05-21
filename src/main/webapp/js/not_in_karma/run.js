// Contents of this file are not to be included in the Karma config because the hurt testability.
app.run(['$rootScope', 'UserService', 'EventService', function ($rootScope, UserService, EventService) {
    UserService.loginByToken();
    UserService.waitLoggedIn().then(function(){
        EventService.load();
    });
}]);
