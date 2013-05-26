'use strict';

// Injecting rootScope only allowed in AppCtrl, because of handling routing errors
angular.module('cfpSpeakerApp')
    .controller('AppCtrl',function ($rootScope, $route, $location) {
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            console.log('$routeChangeError:', arguments);
            if (rejection === 'No valid userToken' || rejection === 'No currentUser') {
                $location.path('/');
            }
        });
        $rootScope.$on('$routeChangeStart', function (event, current, previous, rejection) {
            console.log('$routeChangeStart', arguments);
        });
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous, rejection) {
            console.log('$routeChangeSuccess', arguments);
        });
        $rootScope.$on('$viewContentLoaded', function (event, current, previous, rejection) {
            console.log('$viewContentLoaded', arguments);
        });
    }).controller('LoginCtrl',function ($scope, $location, $window, $cookies, $http, $filter, UserService, EventBus) {
        $scope.model = {
            loginDisabled: false,
            loginError: null,
            currentUser: null
        };

        $scope.login = function () {
            if (!$scope.model.loginDisabled) {
                $scope.model.loginDisabled = true;
                UserService.login($scope.model.email, $scope.model.password);
            }
        };
        $scope.logout = UserService.logout;

        EventBus.onLoginSuccess($scope, function(user, userToken, event) {
            $scope.model.currentUser = user;
            $cookies.userToken = userToken;
            $scope.model.loginError = null;
        });
        EventBus.onLoginFailed($scope, function(reason, event) {
            $scope.model.loginDisabled = false;
            $scope.model.loginError = reason;
        });
        EventBus.onLoggedOut($scope, function(oldUser, oldUserToken, event) {
            $cookies.userToken = '';
            $scope.model.currentUser = null;
            $scope.model.loginDisabled = false;
            $window.location.href = '/index.html#/logged_out';
        });
    }).controller('ProfileCtrl',function ($scope, UserService) {
        $scope.model = {};
//        EventBus.onLoginSuccess($scope, function (user, userToken, event) {
//            $scope.model.speakerDetails = user;
//        });
        $scope.profileComplete = UserService.profileComplete;

        $scope.updateProfile = function () {
            UserService.updateProfile($scope.model.speakerDetails);
        };
    }).controller('HomeCtrl',function ($scope, $location) {
    }).controller('ContactCtrl',function ($scope, $location) {
    }).controller('AboutCtrl',function ($scope, $location) {
    }).controller('TwitterCtrl', function ($scope, $location) {
        $scope.tweets = [
            {
                thumbnail: 'images_dummy/tweeter_dummy.jpg',
                name: '',
                tweet: '1 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
                handle: '@Lialee',
                time: '30 minutes ago'
            },
            {
                thumbnail: 'images_dummy/tweeter_dummy.jpg',
                name: '',
                tweet: '2 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
                handle: '@Lialee',
                time: '30 minutes ago'
            },
            {
                thumbnail: 'images_dummy/tweeter_dummy.jpg',
                name: '',
                tweet: '3 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
                handle: '@Lialee',
                time: '30 minutes ago'
            }
        ];
    });