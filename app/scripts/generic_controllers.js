'use strict';

var cfpSpeakerAppModule = angular.module('cfpSpeakerApp');
// Injecting rootScope only allowed in AppCtrl, because of handling routing errors

cfpSpeakerAppModule.controller('AppCtrl',function ($rootScope, $route, $location, $window) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log('$routeChangeError:', arguments);

        // These redirects must be done using full page refresh, otherwise it messes up the CurrentUser Promise
        if (rejection == 'No valid userToken' || rejection == 'No currentUser') {
            $window.location.href = '/';
            return;
        }
        if (rejection == 'Profile incomplete') {
            $window.location.href = speakerUrlPrefix + '/profile';
            return;
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
});

cfpSpeakerAppModule.controller('LoginCtrl',function ($scope, $location, $window, $cookies, $http, $filter, UserService, EventBus) {
    $scope.model = {
        loginDisabled: false,
        loginError: null
    };
    $scope.model.currentUser = UserService.getCurrentUser;

    UserService.waitForCurrentUser();

    $scope.login = function () {
        if (!$scope.model.loginDisabled) {
            $scope.model.loginDisabled = true;
            UserService.login($scope.model.email, $scope.model.password);
        }
    };
    $scope.logout = UserService.logout;

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

cfpSpeakerAppModule.controller('HomeCtrl', function ($scope, $location) {

});

cfpSpeakerAppModule.controller('ContactCtrl', function ($scope, $location, $http, ContactService) {

    $scope.model = {
        name: null,
        email: null,
        company: null,
        category: {
            sponsoring: false,
            exhibition: false,
            presentations: false,
            practical: false
        },
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

cfpSpeakerAppModule.controller('AboutCtrl', function ($scope, $location) {
});

cfpSpeakerAppModule.controller('TwitterCtrl', function ($scope, $location, $http, $timeout, $window) {
    var self = this;

    var MAX = 3;
    var maxTweetId = 0;

    $scope.tweets = [];
    $scope.scrollClass = "";
    var count = 0;

    $scope.openStatus = function (tweet) {
        $window.location.href = "http://twitter.com/" + tweet.author + "/status/" + tweet.statusId;
    };

    this.refreshRemoteData = function() {
        $http.jsonp("http://search.twitter.com/search.json?q=%23devoxx&count=40&since_id=" + maxTweetId
            + "&include_entities=false&result_type=recent&callback=JSON_CALLBACK")
        .success(function(data, status) {
            //console.log('HTTP Code: ' + code + ' Data: ' + JSON.stringify(data));
            data.results.forEach(function(result){
                var tweet = new Tweet(result);
                // Prevent the latest search result from popping up multiple times in our queue if there aren't any new tweets
                if (maxTweetId != tweet.id) {
                    tweet.class = count % 2 == 0 ? "even" : "";
                    count++;
                    $scope.tweets.push(tweet);
                }
            });

            maxTweetId = data.max_id;
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
        this.statusId = tweet.id_str;
        this.author = tweet.from_user;
        this.image = "url(" + tweet.profile_image_url + ")";
        this.tweet = tweet.text;
        this.time = moment(tweet.created_at, "ddd, DD MMM YYYY HH:mm:ss ZZ").fromNow(); //Thu, 30 May 2013 15:02:41 +0000
        this.source = this.unEscape(tweet.source);
        this.class = "";
    }

    $timeout(self.refreshRemoteData, 0);
});


cfpSpeakerAppModule.factory('AnonymousService', ['$http', '$q' ,function($http, $q) {
    var self = {
        registerUser: function(user) {
            var defer = $q.defer();
            var url = authBaseUri + '/register'
                    + '?firstname={firstname}&lastname={lastname}'
                    + '&username={username}&password={password}&email={email}';
            url = url.replace('{firstname}', user.firstname);
            url = url.replace('{lastname}', user.lastname);
            url = url.replace('{username}', user.username);
            url = url.replace('{password}', user.password);
            url = url.replace('{email}', user.email);

            $http.post(url, {
            }).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        },
        lostPassword: function(email) {
            var defer = $q.defer();
            var url = authBaseUri + '/reset/' + email;

            $http.post(url, {
            }).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        }
    };
    return self;
}]);
