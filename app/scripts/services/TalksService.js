'use strict';

genericServices.factory('TalksService', function ($http, $q, UserService, Tags) {
    var url = proposalUri + '/event/{eventId}/presentation';
    var createUrl = function (url, talk) {
        return url.replace('{eventId}', talk.event.id) + (talk.id ? "/" + talk.id : "" );
    };
    var config = {
        params: {
            userToken: UserService.getToken()
        }
    };
    var transformNewTags = function(talk, arrayOfHttpPromises) {
        console.log('arr', arrayOfHttpPromises)
        for (var i = 0; i < arrayOfHttpPromises.length; i++) {
            var promise = arrayOfHttpPromises[i],
                newTag = promise.data,
                name = newTag.name;
            // Replace tags with tags returned from server
            for (var j = 0; j < talk.tags.length; j++) {
                if (talk.tags[j].name === name) {
                    talk.tags[j] = newTag;
                    break;
                }
            }
        }
    };
    var transform = function (talk) {
        var i;
        var ret = {};
        ret.id = talk.id;
        ret.version = talk.version;
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
        save: function(talk) {
            var method = talk.id ? $http.put : $http.post,
                defer = $q.defer();
            if (talk.nonExistentTags) {
                return Tags.addTags(talk.nonExistentTags).then(function(data) {
                    transformNewTags(talk, data);
                    return method(createUrl(url, talk), transform(talk), config);
                });
            } else {
                method(createUrl(url, talk), transform(talk), config).success(function(data) {
                    defer.resolve(data);
                }).error(function(data) {
                    defer.reject(data);
                });
            }
            return defer.promise;
        },
        allProposalsForUser: function() {
            var url = proposalUri;
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken(),
                    timestamp: new Date().getTime()
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
    }
});