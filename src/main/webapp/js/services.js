'use strict';

var genericServicesModule = angular.module('Generic Services', ['ngResource']);

var baseUri = 'http://localhost/staging-cfp/v2/proposal';
var authBaseUri = 'http://localhost/staging-cfp/v2/auth';

genericServicesModule.factory('EventBus', function($rootScope) {
    var EVENTS_LOADED_MSG = 'devoxx:eventsLoadedMessage';
    return {
        eventsLoaded: function(events) {
            $rootScope.$broadcast(EVENTS_LOADED_MSG, {
                events: events
            });
        },
        onEventsLoaded: function($scope, handler) {
            $scope.$on(EVENTS_LOADED_MSG, function(event, msg) {
                handler(msg.events, event)
            })
        }
    };
});

genericServicesModule.factory('TalksService', function($http) {
    return {
        allTalksForSpeaker: function(event, userToken) {
            var url = baseUri + '/event/{eventId}/presentation'
                    .replace('{eventId}', event.id);
            return $http.get(url, {
                params: {
                    userToken: userToken
                }
            });
        },
        byId: function(event, talk, userToken) {
            var url = baseUri + '/event/{eventId}/presentation/{talkId}'
                    .replace('{eventId}', event.id)
                    .replace('{talkId}', talk.id);
            return $http.get(url, {
                params: {
                    userToken: userToken
                }
            });
        }
    };
});

genericServicesModule.factory('UsersService', function($q, $filter, $http, $cookies) {
    return {
        getCurrentUser: function () {
            var defer = $q.defer();
            if ($cookies.userToken) {
                var url = authBaseUri + '/token';
                $http.post(url, {}, {
                    params: {
                        userToken: $cookies.userToken
                    }
                }).success(function(response) {
//                    console.log('success:', response);
                    defer.resolve(response);
                }).error(function(response) {
//                    console.log('error:', response);
                    defer.reject('No valid userToken');
                });
            } else {
                defer.reject('No valid userToken');
            }
            return defer.promise;
        },
        getSpeakerByEmailAddress: function(email) {
            var url = baseUri + '/user';
            return $http.get(url, {
                params: {
                    q: email,
                    filter: email,
                    userToken: $cookies.userToken
                }
            });
        }
    }
});

genericServicesModule.factory('Tags', function($resource, $q, $filter) {
    var cached;
    var filter = function(list, partialTagName) {
        var ret = angular.copy(list);
        ret = $filter('filter')(ret, partialTagName.toLowerCase());
        ret = $filter('orderBy')(ret, function(o) { return o.name.toLowerCase(); });
        ret = $filter('limitTo')(ret, 10);
        return ret;
    };
    return {
        query: function(partialTagName) {
            var defer = $q.defer();
            if (!cached) {
                var url = baseUri + '/event/1/tag?size=1000';
                var res = $resource(url, { }, {
                    query: { method: 'get', isArray: false }
                });
                res.query({ }, function(data) {
                    cached = data.results;
                    defer.resolve(filter(cached, partialTagName));
                }, function(response) {
                    defer.reject('Error loading tags');
                });
            } else {
                defer.resolve(filter(cached, partialTagName));
            }
            return defer.promise;
        }
    }
});

genericServicesModule.factory('Events', function($resource) {
    var url = baseUri + '/event/:eventId';
    return $resource(url, {}, {
        query: { method: 'get', isArray: true },
        get: { method: 'get', isArray: false }
    });
});

genericServicesModule.factory('Talks', function($http, $cookies) {
    var url = baseUri + '/event/:eventId/presentation';
    var createUrl = function(url, talk) {
        return url.replace(':eventId', talk.event.id)
    };
    var config = {
        params: {
            userToken: $cookies.userToken
        }
    };
    var transform = function(talk) {
        console.log('talk', talk);
        var i;
        var ret = {};
        ret.tags = [];
        for (i = 0; i < talk.tags.length; i++) {
            var tag = talk.tags[i];
            ret.tags.push({
                id: tag.id
            });
        }
        ret.speakers = [];
        for (i = 0; i < talk.speakers.length; i++) {
            var speaker = talk.speakers[i];
            ret.speakers.push({
                id: speaker.id,
                version: speaker.version
            });
        }
        ret.event = {
            id: talk.event.id
        };
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
        ret.sharedProposal = talk.shareWithJugsAllowed;
        console.log('ret', ret);
        return ret;
    };
    return {
        post: function(talk) {
            return $http.post(createUrl(url, talk), transform(talk), config);
        },
        put: function(talk) {
            return $http.put(createUrl(url, talk), transform(talk), config);
        }
    }
});


var a = {"tags": [
    {},
    {}
], "speakers": [
    {"id": 312, "version": 31},
    {"id": 2, "version": 82}
], "event": {"id": 9},
    "language": {"id": "1"},
    "title": "test by jk", "type": {"id": 1, "version": 14, "name": "Conference"}, "track": {"id": 19, "name": "Future<Devoxx>"}, "audienceExperience": "NOVICE", "summary": "summary by jk"}