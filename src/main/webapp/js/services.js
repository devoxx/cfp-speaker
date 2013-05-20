'use strict';

var genericServicesModule = angular.module('GenericServices', ['ngResource', 'Config']);

// var baseUri = 'http://localhost/staging-cfp/v2/proposal';
// var authBaseUri = 'http://localhost/staging-cfp/v2/auth';

var baseUri = 'https://staging-cfp.devoxx.com/v2/proposal';
var authBaseUri = 'https://staging-cfp.devoxx.com/v2/auth';

genericServicesModule.factory('EventBus', function ($rootScope) {
    var EVENTS_LOADED_MSG = 'devoxx:eventsLoadedMessage';
    return {
        eventsLoaded: function (events) {
            $rootScope.$broadcast(EVENTS_LOADED_MSG, {
                events: events
            });
        },
        onEventsLoaded: function ($scope, handler) {
            $scope.$on(EVENTS_LOADED_MSG, function (event, msg) {
                handler(msg.events, event)
            })
        }
    };
});

genericServicesModule.factory('TalksService', function($http, UserService) {
    return {
        allProposalsForEvent: function (eventId) {
            var url = baseUri + '/event/{eventId}/presentation'
                .replace('{eventId}', eventId);

            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        },
        byId: function (eventId, proposalId) {
            var url = baseUri + '/event/{eventId}/presentation/{proposalId}'
                .replace('{eventId}', eventId)
                .replace('{proposalId}', proposalId);
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        }
    };
});

genericServicesModule.factory('UserService', function ($q, $filter, $http, $cookies, $location) {
    var loginDefer = $q.defer();

    function orderTokensByExpiry(loginTokens) {
        var ret = angular.copy(loginTokens) || [];
        ret = $filter('orderBy')(ret, function (token) {
            return token.expires;
        }, true);
        ret = $filter('limitTo')(ret, 1);
        return ret;
    }

    var userService = {
        login: function (username, pass) {
            var url = authBaseUri + '/login';
            return $http.post(url, {}, {
                params: {
                    login: username,
                    password: pass
                }
            }).success(function (data) {
                var tokens = orderTokensByExpiry(data.loginTokens);
                if (tokens && tokens[0] && Date.parse(tokens[0].expires) > new Date().getTime()) {
                    $cookies.userToken = tokens[0].token; // FIXME TODO get token from login
                    loginDefer.resolve(data);
                } else {
                    $cookies.userToken = null;
                    loginDefer.reject("Usertoken expired");
                    $location.path('/login');
                }
            }).error(function() {
                loginDefer.reject("Usertoken expired");
                $location.path('/login');
            });
        },
        loginByToken: function () {
            if ($cookies.userToken) {
                var url = authBaseUri + '/token';
                $http.post(url, {}, {
                    params: {
                        userToken: $cookies.userToken
                    }
                }).success(function (data) {
//                    $location.path('/speaker/proposals')
//                    var tokens = orderTokensByExpiry(data.loginTokens);
//                    if (tokens && tokens[0] && Date.parse(tokens[0].expires) > new Date().getTime()) {
//                        $cookies.userToken = tokens[0].token; // FIXME TODO get token from login
                        loginDefer.resolve(data);
//                    } else {
//                        $cookies.userToken = null;
//                        loginDefer.reject("Usertoken expired");
////                        $location.path('/login');
//                    }
//                    userService.currentUser = data;
//                    loginDefer.resolve(data);
                }).error(function() {
                    loginDefer.reject("Usertoken expired");
//                    $location.path('/login');
                });
            }
        },
        logout: function () {
            if (userService.currentUser) {
                userService.currentUser = null;
                delete $cookies.userToken;
                // FIXME TODO $http.delete(/token)
            }
        },
        profileComplete: function () {
            var profile = userService.currentUser;
            return profile && profile.email && profile.firstname && profile.lastname
                && profile.company && profile.speakerBio && profile.speakingReferences;
        },
        waitLoggedIn: function () {
            return loginDefer.promise;
        },
        getCurrentUser: function () {
            return userService.currentUser;
        },
        getToken: function () {
            return $cookies.userToken;
        },
        getSpeakerByEmailAddress: function (email) {
            var url = baseUri + '/user';
            return $http.get(url, {
                params: {
                    q: email,
                    filter: email,
                    userToken: $cookies.userToken
                }
            });
        },
        updateProfile: function (user) {
            var defer = $q.defer();
            if ($cookies.userToken) {
                var url = authBaseUri + '/profile';
                $http.put(url, user, {
                    params: {
                        userToken: $cookies.userToken
                    }
                }).success(function (response) {
                        defer.resolve(response);
                    }).error(function (response) {
                        defer.reject('No valid userToken');
                    });
            } else {
                defer.reject('No valid userToken');
            }
            return defer.promise;
        }
    };
    return userService;
});

genericServicesModule.factory('Tags', function ($resource, $q, $filter, UserService) {
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
                var url = baseUri + '/event/1/tag?size=1000&userToken=' + UserService.getToken();
                var res = $resource(url, { }, {
                    query: { method: 'get', isArray: false }
                });
                res.query({ }, function (data) {
                    cached = data.results;
                    defer.resolve(filter(cached, partialTagName));
                }, function (response) {
                    defer.reject('Error loading tags');
                });
            } else {
                defer.resolve(filter(cached, partialTagName));
            }
            return defer.promise;
        }
    }
});

genericServicesModule.factory('EventService', function ($http, UserService) {
    var events;
    return {
        load: function () {
            var url = baseUri + '/event';
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            }).success(function (result) {
                events = result;
            });
        },
        getEvents: function () {
            return events;
        }
    };
});

genericServicesModule.factory('Talks', function ($http, $cookies) {
    var url = baseUri + '/event/{eventId}/presentation';
    var createUrl = function (url, talk) {
        return url.replace('{eventId}', talk.event.id)
    };
    var config = {
        params: {
            userToken: $cookies.userToken
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
            id: parseInt(talk.language.id)
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
//        ret.sharedProposal = talk.shareWithJugsAllowed;
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
});

