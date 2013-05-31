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
    }).controller('ProfileCtrl',function ($scope, UserService) {
        $scope.model = {};

        UserService.waitForCurrentUser().then(function(){
                $scope.model.speakerDetails = UserService.currentUser;
        });

        $scope.profileComplete = UserService.profileComplete;

        $scope.updateProfile = function () {
            UserService.updateProfile($scope.model.speakerDetails);
        };
    }).controller('HomeCtrl',function ($scope, $location) {

    }).controller('ContactCtrl',function ($scope, $location) {
    }).controller('AboutCtrl',function ($scope, $location) {
    }).controller('TwitterCtrl', function ($scope, $location, $http, $timeout) {
        
        var self = this;

        var MAX = 4;
        var maxTweetId = 0;

        var tweetQueue = [];
        $scope.tweets = [];
        $scope.scrollClass = "";

        this.refreshRemoteData = function() {

            $http.jsonp("http://search.twitter.com/search.json?q=%23devoxx&rpp=10&since_id=" + maxTweetId  
                + "&include_entities=false&with_twitter_user_id=true&result_type=mixed&callback=JSON_CALLBACK")
            .success(function(data, status) {
                    
                //console.log('HTTP Code: ' + code + ' Data: ' + JSON.stringify(data));

                data.results.forEach(function(result){
                    var tweet = new Tweet(result);
                    // Prevent the latest search result from popping up multiple times in our queue if there aren't any new tweets
                    if (maxTweetId != tweet.id) {
                        tweetQueue.unshift(tweet);
                    }
                });

                maxTweetId = data.max_id;

                if ($scope.tweets.length == 0) {
                    self.tweetQueueProcessor(); // Populate on init
                }

            });

            $timeout(self.refreshRemoteData, 10000);
        }

        this.tweetQueueProcessor = function() {
            
            // Initialisation
            if ($scope.tweets.length < MAX) {
                while ($scope.tweets.length < MAX && tweetQueue.length > 0) {
                    $scope.tweets.push(tweetQueue.shift());
                }

            }

            // Regular operation
            else if (tweetQueue.length > 0) {
                $scope.tweets.push(tweetQueue.shift());
                $scope.scrollClass = "scrollup";
                $timeout(shiftTweets, 1900);
            }

            function shiftTweets() {
                $scope.tweets.shift();
                $scope.scrollClass = "";
            }

            $timeout(self.tweetQueueProcessor, 3000);
        }

        function Tweet(tweet) {

            this.id = tweet.id;
            this.author = tweet.from_user;
            this.image = tweet.profile_image_url;
            this.tweet = tweet.text;
            this.time = moment(tweet.created_at, "ddd, DD MMM YYYY HH:mm:ss ZZ").fromNow(); //Thu, 30 May 2013 15:02:41 +0000

            this.toString = function() {
                return this.author + " " + this.id;
            }
        }

        $timeout(self.refreshRemoteData, 0);
        
    });