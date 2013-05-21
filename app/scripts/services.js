'use strict';

var baseUri = 'https://staging-cfp.devoxx.com/v2/proposal';
var authBaseUri = 'https://staging-cfp.devoxx.com/v2/auth';

angular.module('GenericServices', ['ngResource', 'ngCookies', 'Config'])
  .factory('EventBus',function ($rootScope) {
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
  }).factory('TalksService',function ($http, UserService) {
    return {
      allTalksForSpeaker: function (event) {

        var url = baseUri + '/event/{eventId}/presentation'
          .replace('{eventId}', event.id);

        return $http.get(url, {
          params: {
            userToken: UserService.getToken()
          }
        });
      },
      byId: function (event, talk, userToken) {
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
  }).factory('UserService',function ($q, $filter, $http, $cookies, $location) {

    var defer = $q.defer();

    var userService = {
      login: function (username, pass) {
        var url = authBaseUri;
        return $http.post(url, {}, {
          params: {
            login: username,
            password: pass
          }
        }).success(function (data) {
            $cookies.userToken = data.userToken; // FIXME TODO get token from login
            userService.currentUser = data;
            defer.resolve();
            if (!userService.profileComplete()) {
              $location.path("/profile");
            }
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
              userService.currentUser = data;
              defer.resolve();
              if (!userService.profileComplete()) {
                $location.path("/profile");
              }
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
        return defer.promise;
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
    return  userService;
  }).factory('Tags',function ($resource, $q, $filter) {
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
          var url = baseUri + '/event/1/tag?size=1000';
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
  }).factory('EventService',function ($http, UserService) {

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
  }).factory('Talks', function ($http, $cookies) {
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
      post: function (talk) {
        return $http.post(createUrl(url, talk), transform(talk), config);
      },
      put: function (talk) {
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