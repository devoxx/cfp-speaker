'use strict';

speakerModule.controller(speakerCtrlPrefix + 'SubmitProposalCtrl', 
    [ '$q', '$scope', '$filter', 'UserService', 'Tags', 'TalksService', 'EventService', '$routeParams', '$location', 'currentUser',
 function ($q, $scope, $filter, UserService, Tags, TalksService, EventService, $routeParams, $location, currentUser) {

    var MIN_TAGS = 3, MAX_TAGS = 8,
        MIN_SPEAKERS = 1,
        MIN_SUMMARY_LENGTH = 10, MAX_SUMMARY_LENGTH = 1000;

    $scope.model = {
        talk: {},
        speakerDetails: {},
        addSpeakerDialogOpen: false,
        editable: true,
        newTag: '',
        currentUser: currentUser,
        experienceOptions: [
            { value: 'NOVICE', text: 'NOVICE' },
            { value: 'SENIOR', text: 'SENIOR' },
            { value: 'EXPERT', text: 'EXPERT' }
        ],
        languageOptions: [
            { value: '2', text: 'US'}
        ]
    };

    EventService.getEvents().then(function (data) {
        $scope.model.events = data;
        if ($routeParams.proposalId) {
            $scope.initializeForEdit($routeParams.proposalId);
        } else {
            $scope.initializeForAdd();
        }
    });

    $scope.$watch('model.talk.event', function(newEvent, oldEvent){
        if (!!newEvent && !!oldEvent && newEvent.id !== oldEvent.id) {
            $scope.model.talk.track = null;
            $scope.model.talk.type = null;                
        }
    });

    $scope.initializeForAdd = function () {
        $scope.model.talk = {
            state: 'DRAFT',
            tags: [],
            speakers: [],
            language: '2',
            id: null // Probably useless, but this is explicit
        };
        $scope.model.talk.speakers.push($scope.model.currentUser);
        $scope.model.events = $scope.filterOpenEvents($scope.model.events);
        if ($scope.model.events.length == 1) {
            $scope.model.talk.event = $scope.model.events[0];
        }
    };

    $scope.matchOnId = function (list, obj) {
        if (obj) {
            var objId = obj.id;

            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var listItem = list[i];
                    if (listItem.id === objId) {
                        return listItem;
                    }
                }
            }
        }

        return null;
    };

    $scope.filterOpenEvents  = function (events) {
        var res = [];
        events.forEach(function(event) { if ($scope.isOpen(event)) { res.push(event); } });
        return res;
    };

    $scope.initializeForEdit = function (proposalId) {
        TalksService.byId(proposalId).success(function (data) {
            var model = $scope.model;
            model.talk = data;

            if (!model.talk.speakers) {
                model.talk.speakers = [];
            }
            if ($scope.speakerWithSearchNameDoesNotExist(model.talk.speakers, data.author)) {
                model.talk.speakers.push($scope.model.currentUser);
            }

            var event = $scope.matchOnId(model.events, data.event);
            model.editable = $scope.isOpen(event);

            if (!model.editable) {
                model.events = [ event ];
            } else {
                $scope.model.events = $scope.filterOpenEvents($scope.model.events);
            }

            model.talk.event = event;
            model.talk.track = $scope.matchOnId(event.tracks, data.track);
            model.talk.type = $scope.matchOnId(event.types, data.type);
            model.talk.language = $scope.matchOnId($scope.languageOptions, data.language);
        }).error(function (data) {
            $location.path('/speaker/proposals');
        });
    };

    $scope.isOpen = function (event) {
        return moment().isAfter(event.cfpFrom) && moment().isBefore(moment(event.cfpTo).add({days:1}));
    };

    $scope.getTags = function (partialTagName) {
        return Tags.query(partialTagName);
    };

    $scope.filterTagNames = function (tags) {
        if (tags) {
            return $.map(tags, function (tag) {
                return tag && tag.name;
            });
        }
        return [];
    };

    $scope.addTag = function () {
        var model = $scope.model;
        var tags = model.talk.tags;
        if (model.newTag &&
            tags.length < MAX_TAGS &&
            this.filterTagNames(tags).indexOf(model.newTag) == -1) {
            Tags.query(model.newTag).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var tag = data[i];
                    if (tag.name === model.newTag) {
                        tags.push(tag);
                        break;
                    }
                }
                model.newTag = '';
            });
        }
    };

    $scope.thumbnailUrl = function (speaker) {
        return UserService.thumbnailUrl(speaker);
    };

    $scope.getSpeakers = function (partialSpeakerName) {
        return UserService.getSpeakerBySearchName(partialSpeakerName).then(function(data) {
            return $scope.getSpeakerBySearchName(data, partialSpeakerName, true);
        });
    };

    $scope.createFullName = function(speaker) {
        return speaker && speaker.firstname + ' ' + speaker.lastname;
    };

    $scope.getSpeakerBySearchName = function(speakers, searchName, acceptPartialMatches) {
        var ret = speakers;
        acceptPartialMatches = acceptPartialMatches === true;
        searchName = searchName.toLowerCase();
        if (!ret) {
            return ret;
        }
        ret = $filter('filter')(ret, function (speaker) {
            var speakerName = $scope.createFullName(speaker).toLowerCase();
            if (acceptPartialMatches) {
                return speakerName.indexOf(searchName) != -1;
            } else {
                return speakerName === searchName;
            }
        });
        ret = $filter('orderBy')(ret, function(speaker) {
            return $scope.createFullName(speaker).toLowerCase();
        });
        return ret;
    };

    $scope.speakerWithSearchNameDoesNotExist = function (speakers, search) {
        if (search.firstname && search.lastname) {
            search = $scope.createFullName(search);
        }

        return $scope.getSpeakerBySearchName(speakers, search).length == 0;
    };

    $scope.addSpeaker = function () {
        var model = $scope.model,
            searchName = model.searchSpeakerName;

        if (searchName && $scope.speakerWithSearchNameDoesNotExist(model.talk.speakers, searchName)) {
            UserService.getSpeakerBySearchName(searchName).then(function (data) {
                // This service returns also returns users where the searchName is a partial match.
                // So we need to be prepared for unexpected/multiple results
                var speakersFromServer = $scope.getSpeakerBySearchName(data, searchName);
                if (speakersFromServer.length == 1) {
                    var speakerFromServer = speakersFromServer[0];
                    var searchNameFromServer = $scope.createFullName(speakerFromServer);

                    // Double check because of asynchronous call (prevents double tap on return key)
                    if ($scope.speakerWithSearchNameDoesNotExist(model.talk.speakers, searchNameFromServer)) {
                        model.talk.speakers.push(speakerFromServer);
                        model.searchSpeakerName = '';
                    }
                } else {
                    model.addSpeakerDialogOpen = true;
                    var firstname = '', lastname = '';
                    if (searchName.split(' ').length > 1) {
                        firstname = searchName.split(' ')[0];
                        lastname = searchName.substring(firstname.length + 1);
                    }
                    model.speakerDetails = {
                        firstname: firstname,
                        lastname: lastname,
                        twitterHandle: '@'
                    };
                }
            }, function (data) {
                console.log(data)
            });
        }
    };

    $scope.addNewSpeaker = function (speaker) {
        speaker.unknown = true;
        $scope.model.talk.speakers.push(angular.copy(speaker));
        $scope.model.searchSpeakerName = '';
        $scope.model.addSpeakerDialogOpen = false;
    };

    $scope.closeNewSpeaker = function (speaker) {
        $scope.model.addSpeakerDialogOpen = false;
    };

    $scope.isFormValid = function (talk, submitProposalForm) {
        if (!submitProposalForm.$valid) {
            return false;
        } else {
            var valid = true;
            // Additional Form level validations
            if (talk.tags.length < MIN_TAGS ||
                talk.tags.length > MAX_TAGS) {
                valid = false;
                submitProposalForm.addTag.$valid = false;
                submitProposalForm.addTag.$error = { 'range': true };
            }
            if (talk.speakers.length < MIN_SPEAKERS) {
                valid = false;
                submitProposalForm.addSpeaker.$valid = false;
                submitProposalForm.addSpeaker.$error = { 'range': true };
            }
            if (!talk.event || !talk.track || !talk.type || !talk.audienceExperience || !talk.title || !$scope.model.termsAndConditionsAgreed) {
                valid = false;
            }

            if (talk.summary.length < MIN_SUMMARY_LENGTH ||
                talk.summary.length > MAX_SUMMARY_LENGTH) {
                valid = false;
            }

            return valid;
        }
    };

    $scope.submit = function (talk, submitProposalForm) {
        if (!this.isFormValid(talk, submitProposalForm)) {
            return;
        }
        if (!$scope.isSubmitted) {
            $scope.isSubmitted = true;
            TalksService.save(talk)
                .success(function () {
                    $location.path('/speaker/proposals');
                }).error(function (error) {
                    $scope.isSubmitted = false;
                });
        }
    };
    $scope.cancel = function (talk) {
        $scope.model.talk = {};
        $location.path('/speaker/proposals')
    };
}]);
