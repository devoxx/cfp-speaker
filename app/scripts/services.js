'use strict';

var baseUri = 'https://staging-cfp.devoxx.com/v2/proposal';
var authBaseUri = 'https://staging-cfp.devoxx.com/v2/auth';

var genericServices = angular.module('GenericServices', ['ngResource', 'ngCookies', 'Config'])

genericServices.factory('TalksService',function ($http, UserService) {
    return {
        allProposalsForUser: function () {
            var url = baseUri;
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        },
        byId: function (proposalId) {
            var url = baseUri + '/{proposalId}'
                .replace('{proposalId}', proposalId);
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        },
        deleteProposal: function(proposal) {
            var url = baseUri + '/' + proposal.id;
            return $http.delete(url, {
                params: {
                    userToken: UserService.getToken()
                }
            });
        }
    };
}).factory('UserService',function ($q, $filter, $http, $cookies, $location, EventBus) {
    var userService = {
        currentUser: null,
        currentUserToken: null,
        loginValidationFinished: false,
        currentUserDefer: $q.defer(),

        login: function (username, pass) {
            var url = authBaseUri;
            return $http.post(url, {}, {
                params: {
                    login: username,
                    password: pass
                }
            }).success(function (data, status, headers, config) {
                console.log('successful login with username/password');
                userService.currentUser = data.user;
                userService.userToken = data.userToken;

                console.log('successful username/password login', data.userToken);
                EventBus.loginSuccess(data.user, data.userToken);
            }).error(function (data, status, headers, config) {
                console.log(data);
                EventBus.loginFailed(data.msg);
            });
        },
        loginByToken: function (userToken) {
            userService.userToken = userToken;
            var url = authBaseUri + '/token';
            $http.post(url, {}, {
                params: {
                    userToken: userToken
                }
            }).success(function (data, status, headers, config) {
                console.log('successful login with token')
                userService.currentUser = data;
                EventBus.loginSuccess(data, userToken);
                userService.currentUserDefer.resolve(userService.currentUser);
            }).error(function (data, status, headers, config) {
                EventBus.loginFailed(data.msg);
                userService.currentUser = null;
                userService.currentUserDefer.reject('No currentUser');
            });
        },
        logout: function () {
            var oldToken = userService.userToken;
            var callback = function(data, status, headers, config) {
                userService.currentUser = null;
                userService.userToken = '';
                EventBus.loggedOut(userService.currentUser, oldToken);
            };
            if (oldToken && oldToken.length > 0) {
                var url = authBaseUri + '/logout/' + oldToken;
                $http.delete(url).success(callback).error(callback);
            }
        },
        profileComplete: function () {
            var profile = userService.currentUser;
            return profile && profile.email && profile.firstname && profile.lastname
                && profile.company && profile.speakerBio && profile.speakingReferences;
        },
        waitForCurrentUser: function () {
            return userService.currentUserDefer.promise;
        },
        getToken: function () {
            return userService.userToken;
        },
        getSpeakerByEmailAddress: function (email) {
            var url = baseUri + '/user';
            return $http.get(url, {
                params: {
                    q: email,
                    filter: email,
                    userToken: userService.userToken
                }
            });
        },
        updateProfile: function (user) {
            var defer = $q.defer();
            if (userService.userToken) {
                var url = authBaseUri + '/profile';
                $http.put(url, user, {
                    params: {
                        userToken: userService.userToken
                    }
                }).success(function(data, status, headers, config) {
                    defer.resolve(response);
                }).error(function (data, status, headers, config) {
                    defer.reject('No valid userToken');
                });
            } else {
                defer.reject('No valid userToken');
            }
            return defer.promise;
        }
    };
    return userService;
}).factory('Tags',function ($resource, $q, $filter, UserService) {
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
}).factory('EventService',function ($http, $q, $filter, UserService) {
    var eventService = {
        eventsDefer: null,
        load: function () {
            var url = baseUri + '/event';
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            }).success(function (result, status, headers, config) {
                var list = result;
                list = $filter('orderBy')(list, function(o) {
                    return o.cfpTo;
                });
                eventService.eventsDefer.resolve(list);
            }).error(function(result, status, headers, config) {
                eventService.eventsDefer.reject(result);
            });
        },
        getEvents: function () {
            if (!eventService.eventsDefer) {
                eventService.eventsDefer = $q.defer();
                eventService.load();
            }
            return eventService.eventsDefer.promise;
        }
    };
    return eventService;
}).factory('Talks', function ($http, UserService) {
    var url = baseUri + '/event/{eventId}/presentation';
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
            id: parseInt(talk.language.value)
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
});

