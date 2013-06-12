'use strict';

genericServices.factory('UserService',function ($q, $filter, $http, $timeout, $cookies, $location, EventBus) {
    var self = {
        currentUser: null,
        currentUserToken: $cookies.userToken,
        currentUserDefer: $q.defer(),
        loginRequestedDefer: $q.defer(),
        searchUserCache: {},

        login: function (username, pass) {
            return $http.post(authUri, {}, {
                params: {
                    login: username,
                    password: pass
                }
            }).success(function (data, status, headers, config) {
                    self.currentUser = data.user;
                    self.currentUserToken = data.userToken;

                    EventBus.loginSuccess(data.user, data.userToken);
                    self.currentUserDefer.resolve(self.currentUser);
                }).error(function (data, status, headers, config) {
                    EventBus.loginFailed(data.msg);
                    self.currentUserDefer.reject('No currentUser');
                });
        },
        loginByToken: function () {
            if (self.currentUserToken) {
                $http.post(authUri + '/token', {}, {
                    params: {
                        userToken: self.currentUserToken
                    }
                }).success(function (data, status, headers, config) {
                        self.currentUser = data;
                        EventBus.loginSuccess(data, self.currentUserToken);
                        self.currentUserDefer.resolve(self.currentUser);
                    }).error(function (data, status, headers, config) {
                        EventBus.loginFailed(data.msg);
                        self.currentUser = null;
                        self.currentUserDefer.reject('No currentUser');
                    });
            }
        },
        logout: function () {
            var oldToken = self.currentUserToken;
            var callback = function (data, status, headers, config) {
                self.currentUser = null;
                self.currentUserToken = '';
                self.currentUserDefer = $q.defer();
                self.loginRequestedDefer = $q.defer();
                EventBus.loggedOut(self.currentUser, oldToken);
            };
            if (oldToken && oldToken.length > 0) {
                var url = authUri + '/logout/' + oldToken;
                $http.delete(url).success(callback).error(callback);
            }
        },
        isProfileComplete: function (speaker) {
            return speaker && speaker.email && speaker.firstname && speaker.lastname
                && speaker.company && speaker.speakerBio && speaker.speakingReferences;
        },
        waitForCurrentUser: function () {
            return self.currentUserDefer.promise;
        },
        waitForCurrentUserAndRequestLogin: function () {
            self.requestLogin();
            return self.currentUserDefer.promise;
        },
        waitForLoginRequest: function() {
            return self.loginRequestedDefer.promise;
        },
        requestLogin: function() {
            self.loginRequestedDefer.resolve();
        },
        getCurrentUser: function () {
            return self.currentUser;
        },
        getToken: function () {
            return self.currentUserToken;
        },
        getSpeakerBySearchName: function (searchName) {
            var defer = $q.defer();
            var cache = self.searchUserCache;
            var searchNameCacheEntry = cache[searchName];
            if (!searchNameCacheEntry) {
                var url = proposalUri + '/user';
                var namesSplitted = searchName.split(' ');
                $http.get(url, {
                    params: {
                        q: namesSplitted,
                        filter: searchName,
                        userToken: self.currentUserToken
                    }
                }).success(function(data) {
                        cache[searchName] = data.results;
                        defer.resolve(data.results)
                    }).error(function(data) {
                        defer.reject(data);
                    });
            } else {
                defer.resolve(searchNameCacheEntry);
            }
            return defer.promise;
        },
        updateProfile: function (user) {
            var url = authUri + '/profile';
            return $http.put(url, user, {
                params: {
                    userToken: self.currentUserToken
                }
            }).success(function(data){
                    self.currentUser = user;
                    self.currentUserDefer = $q.defer();
                    self.currentUserDefer.resolve(self.currentUser);
                });
        },
        thumbnailUrl: function(user) {
            user = user || self.currentUser;
            if (user.id && user.imageFile && user.imageFile.length) {
                return 'http://devoxxcfp.s3.amazonaws.com/images/' + user.id + '/' + user.imageFile;
            } else {
                return '/images_dummy/no_avatar.gif';
            }
            return
        }

    };
    return self;
});
