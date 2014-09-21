'use strict';

// Injecting rootScope only allowed in AppCtrl, because of handling routing errors
cfpSpeakerApp.controller('AppCtrl',function ($rootScope, $route, $location, $window) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        // console.log('$routeChangeError:', arguments);

        if (rejection == 'emptyprofile') {
            $location.path(speakerUrlPrefix + '/profile');
            return;
        }
    });
    $rootScope.$on('$routeChangeStart', function (event, current, previous, rejection) {
        // console.log('$routeChangeStart', arguments);
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous, rejection) {
        // console.log('$routeChangeSuccess', arguments);
    });
    $rootScope.$on('$viewContentLoaded', function (event, current, previous, rejection) {
        // console.log('$viewContentLoaded', arguments);
    });
});

cfpSpeakerApp.controller('LoginCtrl',function ($scope, $location, $window, $cookies, $http, $filter, UserService, EventBus) {
    $scope.model = {
        loginDisabled: false,
        loginError: null,
        loginRequested: false
    };
    $scope.model.currentUser = UserService.getCurrentUser;

    $scope.login = function () {
        if (!$scope.model.loginDisabled) {
            $scope.model.loginDisabled = true;
            UserService.login($scope.model.email, $scope.model.password).then(function(){
                $scope.model.loginRequested = false;
                $window.location.reload();
                hookLoginRequest();
            });
        }
    };

    $scope.logout = function () {
        UserService.logout();
    };

    function hookLoginRequest() {
        UserService.waitForLoginRequest().then(function() {
            $scope.model.loginRequested = true;
        });
    }
    
    hookLoginRequest();

    EventBus.onLoginSuccess($scope, function (user, userToken, event) {
//            $scope.model.currentUser = user;
        $cookies.userToken = userToken;
        $scope.model.loginError = null;
    });
    EventBus.onLoginFailed($scope, function (reason, event) {
        $scope.model.loginDisabled = false;
        $scope.model.loginError = reason;
    });
    EventBus.onLoggedOut($scope, function (oldUser, oldUserToken, event) {
        $cookies.userToken = '';
//            $scope.model.currentUser = null;
        $scope.model.loginDisabled = false;
        $window.location.href = '/index.html#/logged_out';
    });
});

cfpSpeakerApp.controller('HomeCtrl', function ($scope, $location) {

});

cfpSpeakerApp.controller('ContactCtrl', function ($scope, $location, $http, ContactService) {

    $scope.model = {
        name: null,
        email: null,
        company: null,
        question: null
    };

    $scope.feedback = null;

    $scope.send = function() {

        $scope.feedback = null;

        ContactService.send($scope.model)
            .success(function () {
                $scope.feedback = {
                    type: 'info',
                    message: 'Message sent, we\'ll contact you as soon as possible'
                }
            })
            .error(function () {
                $scope.feedback = {
                    type: 'error',
                    message: 'Failed to send your message, please try again'
                }
            });
    }

});

cfpSpeakerApp.controller('AboutCtrl', function ($scope, $location) {
});

cfpSpeakerApp.controller('TwitterCtrl', function ($scope, $location, $http, $timeout, $window) {
    var self = this;

    $scope.tweets = [];
    var count = 0;

    $scope.openStatus = function (tweet) {
        $window.location.href = "http://twitter.com/" + tweet.author + "/status/" + tweet.statusId;
    };

    $scope.refreshRemoteData = function() {
        $http.get(baseUri + "twitter/devoxx")
            .success(function(data, status) {
                //console.log('HTTP Code: ' + code + ' Data: ' + JSON.stringify(data));
                data.forEach(function(result){
                    var tweet = new Tweet(result);
                    // Prevent the latest search result from popping up multiple times in our queue if there aren't any new tweets
                    
                    tweet.class = count % 2 == 0 ? "even" : "";
                    count++;
                    $scope.tweets.push(tweet);
                    
                });
                
            });
    };

    function Tweet(tweet) {
        
        this.toString = function() {
            return this.author + " " + this.id;
        };

        this.unEscape = function (html) {
            return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
        };

        this.id = tweet.id;
        this.statusId = tweet.idString;
        this.author = tweet.fromUser;
        this.image = "url(" + tweet.profileImageUrl + ")";
        this.tweet = tweet.text;
        this.time = moment(tweet.createdAt).fromNow(); //Thu, 30 May 2013 15:02:41 +0000
        this.source = this.unEscape(tweet.source);
        this.class = "";
    }

    $scope.refreshRemoteData();
});


