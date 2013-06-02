'use strict';

var baseUri = 'https://staging-cfp.devoxx.com/v2/';
var proposalUri = baseUri + 'proposal';
var authUri = baseUri + 'auth';
var contactUri = baseUri + 'contact'

var genericServices = angular.module('GenericServices', ['ngCookies'])

genericServices.factory('TalksService',function ($http, UserService) {
    return {
        allProposalsForUser: function () {
            var url = proposalUri;
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        },
        byId: function (proposalId) {
            var url = proposalUri + '/{proposalId}'
                .replace('{proposalId}', proposalId);
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        },
        deleteProposal: function (proposal) {
            var url = proposalUri + '/' + proposal.id;
            return $http.delete(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        }
    };
}).factory('UserService',function ($q, $filter, $http, $timeout, $cookies, $location, EventBus) {
        var self = {
            currentUser: null,
            currentUserToken: $cookies.userToken,
            loginValidationFinished: false,
            currentUserDefer: $q.defer(),

            login: function (username, pass) {
                return $http.post(authUri, {}, {
                    params: {
                        login: username,
                        password: pass
                    }
                }).success(function (data, status, headers, config) {
                    console.log('successful login with username/password');
                    self.currentUser = data.user;
                    self.currentUserToken = data.userToken;

                    EventBus.loginSuccess(data.user, data.userToken);
                    self.currentUserDefer.resolve(self.currentUser);
                }).error(function (data, status, headers, config) {
                    console.log(data);
                    EventBus.loginFailed(data.msg);
                    self.currentUserDefer.reject('No currentUser');
                });
            },
            loginByToken: function (userToken) {
                self.currentUserToken = userToken;
                $http.post(authUri + '/token', {}, {
                    params: {
                        userToken: userToken
                    }
                }).success(function (data, status, headers, config) {
                    console.log('successful login with token')
                    self.currentUser = data;
                    EventBus.loginSuccess(data, userToken);
                    self.currentUserDefer.resolve(self.currentUser);
                }).error(function (data, status, headers, config) {
                    EventBus.loginFailed(data.msg);
                    self.currentUser = null;
                    self.currentUserDefer.reject('No currentUser');
                });
            },
            logout: function () {
                var oldToken = self.currentUserToken;
                var callback = function (data, status, headers, config) {
                    self.currentUser = null;
                    self.currentUserToken = '';
                    self.currentUserDefer = $q.defer();
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
                var currentUserToken = self.currentUserToken;
                if (currentUserToken) {
                    var currentUser = self.currentUser;
                    if (currentUser) {
                        self.currentUserDefer.resolve(currentUser);
                    } else {
                        self.loginByToken(currentUserToken);
                    }
                }

                return self.currentUserDefer.promise;
            },
            getCurrentUser: function () {
                return self.currentUser;
            },
            getToken: function () {
                return self.currentUserToken;
            },
            getSpeakerBySearchName: function (searchName) {
                var url = proposalUri + '/user';
                var namesSplitted = searchName.split(' ');
                return $http.get(url, {
                    params: {
                        q: namesSplitted,
                        filter: searchName,
                        userToken: self.currentUserToken
                    }
                });
            },
            updateProfile: function (user) {
                var defer = $q.defer();
                var url = authUri + '/profile';
                $http.put(url, user, {
                    params: {
                        userToken: self.currentUserToken
                    }
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    defer.reject(data);
                });
                return defer.promise;
            }
        };
        return self;
    }).factory('Tags',function ($http, $q, $filter, UserService) {
        var cached;
        var filter = function (list, partialTagName) {
            var ret = angular.copy(list);
            ret = $filter('filter')(ret, partialTagName.toLowerCase());
            ret = $filter('orderBy')(ret, function (o) {
                return o.name.toLowerCase();
            });
            ret = $filter('limitTo')(ret, 10);
            return ret;
        };
        return {
            query: function (partialTagName) {
                var defer = $q.defer();
                if (!cached) {
                    var url = proposalUri + '/event/1/tag?size=1000&userToken=' + UserService.getToken();
                    $http.get(url, {
                    }).success(function (data, status, headers, config) {
                        cached = data.results;
                        defer.resolve(filter(cached, partialTagName));
                    }).error(function (data, status, headers, config) {
                        defer.reject('Error loading tags');
                    });
                } else {
                    defer.resolve(filter(cached, partialTagName));
                }
                return defer.promise;
            }
        }
    }).factory('EventService',function ($http, $q, $filter, UserService) {
        var eventService = {
            eventsDefer: $q.defer(),
            load: function () {
                var url = proposalUri + '/event';
                return $http.get(url, {
                    params: {
                        userToken: UserService.getToken()
                    }
                }).success(function (result, status, headers, config) {
                        var list = result;
                        list = $filter('orderBy')(list, function (o) {
                            return o.cfpTo;
                        });
                        eventService.eventsDefer.resolve(list);
                    }).error(function (result, status, headers, config) {
                        eventService.eventsDefer.reject(result);
                    });
            },
            getEvents: function () {
                UserService.waitForCurrentUser().then(function () {
                    eventService.load();
                });
                return eventService.eventsDefer.promise;
            }
        };
        return eventService;
    }).factory('Talks', function ($http, UserService) {
        var url = proposalUri + '/event/{eventId}/presentation';
        var createUrl = function (url, talk) {
            return url.replace('{eventId}', talk.event.id)
        };
        var config = {
            params: {
                userToken: UserService.getToken()
            }
        };
        var transform = function (talk) {
            var i;
            var ret = {};
            ret.tags = [];
            if (talk.tags) {
                for (i = 0; i < talk.tags.length; i++) {
                    var tag = talk.tags[i];
                    ret.tags.push({
                        id: tag.id
                    });
                }
            }
            ret.speakers = [];
            if (talk.speakers) {
                for (i = 0; i < talk.speakers.length; i++) {
                    var speaker = talk.speakers[i];
                    ret.speakers.push({
                        id: speaker.id,
                        version: speaker.version
                    });
                }
            }
            ret.language = {
                id: '2' // TODO: 2 means English, which is the only option for Devoxx BE
            };
            ret.title = talk.title;
            ret.type = {
                id: talk.type.id,
                version: talk.type.version,
                name: talk.type.name
            };
            ret.track = {
                id: talk.track.id,
                name: talk.track.name
            };
            ret.audienceExperience = talk.audienceExperience;
            ret.summary = talk.summary;
            ret.extraInfo = talk.extraInfo;
            ret.sharedProposal = talk.sharedProposal;
            return ret;
        };
        return {
            post: function (talk) {
                return $http.post(createUrl(url, talk), transform(talk), config);
            },
            put: function (talk) {
                return $http.put(createUrl(url, talk), transform(talk), config);
            }
        }
    })
.factory('ContactService',function ($http) {
    return {
        send: function (contactInfo) {;
            return $http.post(contactUri, contactInfo);
        }
    };
})

.factory('AnonymousService', ['$http', '$q' ,function($http, $q) {
    var self = {
        registerUser: function(user) {
            var url = authUri + '/register';

            return $http.post(url, user);

        },
        lostPassword: function(email) {
            var url = authUri + '/reset/' + email;

            return $http.post(url, {});
        },
        changePassword: function(token, password) {

            var url = authUri + '/change';

            return $http.post(url, { tokens: token, password: password });
        }
    };
    return self;
}])
;



