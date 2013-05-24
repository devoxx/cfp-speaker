'use strict';

genericServices.factory('EventBus', function($rootScope) {
    var EVENTS_LOADED_MSG = 'devoxx:eventsLoadedMessage',
        LOGIN_SUCCESS_MSG = 'devoxx:loginSuccessMessage',
        LOGIN_FAILED_MSG = 'devoxx:loginFailedMessage',
        LOGGED_OUT_MSG = 'devoxx:loggedOut';
    return {
        eventsLoaded: function(events) {
            $rootScope.$broadcast(EVENTS_LOADED_MSG, {
                events: events
            });
        },
        onEventsLoaded: function($scope, handler) {
            $scope.$on(EVENTS_LOADED_MSG, function (event, msg) {
                handler(msg.events, event)
            })
        },
        loginSuccess: function(user, userToken) {
            $rootScope.$broadcast(LOGIN_SUCCESS_MSG, {
                user: user,
                userToken: userToken
            });
        },
        onLoginSuccess: function($scope, handler) {
            $scope.$on(LOGIN_SUCCESS_MSG, function(event, msg) {
                handler(msg.user, msg.userToken, event);
            })
        },
        loginFailed: function(reason) {
            $rootScope.$broadcast(LOGIN_FAILED_MSG, {
                reason: reason
            });
        },
        onLoginFailed: function($scope, handler) {
            $scope.$on(LOGIN_FAILED_MSG, function(event, msg) {
                handler(msg.reason, event);
            });
        },
        loggedOut: function(oldUser, oldUserToken) {
            $rootScope.$broadcast(LOGGED_OUT_MSG, {
                oldUser: oldUser,
                oldUserToken: oldUserToken
            })
        },
        onLoggedOut: function($scope, handler) {
            $scope.$on(LOGGED_OUT_MSG, function(event, msg) {
                handler(msg.oldUser, msg.oldUserToken, event);
            });
        }
    };
})