'use strict';

speakerModule.controller(speakerCtrlPrefix + 'SubmitProposalCtrl', function ($q, $scope, $filter, UserService, Tags, Talks, TalksService, EventService, $routeParams, $location) {
    $scope.model = {
        talk: {},
        speakerDetails: {},
        addSpeakerDialogOpen: false,
        newTag: '',
        opts: {
            backdropFade: true,
            dialogFade: true
        },
        currentUser: null,
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
        if ($scope.isNew) {
            if ($scope.model.events.length == 1) {
                $scope.model.talk.event = $scope.model.events[0];
            }
        }

    });

    $scope.initializeForAdd = function () {
        $scope.model.talk = {
            state: 'DRAFT',
            tags: [],
            speakers: [],
            language: '2'
        };
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

    $scope.initializeForEdit = function (proposalId) {
        TalksService.byId(proposalId).success(function (data, status, headers, config) {
            var model = $scope.model;
            model.talk = data;
            if (!model.speakers) {
                model.speakers = [];
            }
            console.log(data.author.firstname)
            console.log(data.author.lastname)
            if ($scope.speakerWithSearchNameDoesNotExist(model.talk.speakers, data.author)) {
                model.talk.speakers.push(data.author);
            }

            var event = $scope.matchOnId(model.events, data.event);
            model.talk.event = event;
            model.talk.track = $scope.matchOnId(event.tracks, data.track);
            model.talk.type = $scope.matchOnId(event.types, data.type);
            model.talk.language = $scope.matchOnId($scope.languageOptions, data.language);
            console.log('$scope.model', $scope.model);
        }).error(function (data, status, headers, config) {
            console.log(data)
            $location.path('/proposals');
        });
    };

    if ($routeParams.proposalId) {
        $scope.isNew = false;
        $scope.initializeForEdit($routeParams.proposalId);
    } else {
        $scope.isNew = true;
        $scope.initializeForAdd();
    }

    UserService.waitForCurrentUser().then(function (data) {
        if ($scope.isNew) {
            $scope.model.talk.speakers.push(data);
        }
        $scope.model.currentUser = data;
    });

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
        if (model.newTag
            && this.filterTagNames(tags).indexOf(model.newTag) == -1) {
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

    $scope.createAvatarUrl = function (id, imageFile) {
        if (id && imageFile && imageFile.length) {
            return 'http://devoxxcfp.s3.amazonaws.com/images/' + id + '/' + imageFile;
        } else {
            return '/images_dummy/no_avatar.gif';
        }
    };

    $scope.createSearchName = function(speaker) {
        return speaker.firstname + ' ' + speaker.lastname;
    };

    $scope.getSpeakerBySearchName = function(speakers, searchName) {
        searchName = searchName && searchName.toLowerCase()
        if (!speakers) {
            return [];
        }
        return $filter('filter')(speakers, function (speaker) {
            var firstname = speaker.firstname && speaker.firstname.toLowerCase();
            var lastname = speaker.lastname && speaker.lastname.toLowerCase();
            return searchName.indexOf(firstname) !== -1
                && searchName.indexOf(lastname) !== -1
                && searchName === $scope.createSearchName(speaker).toLowerCase();
        });
    };

    $scope.speakerWithSearchNameDoesNotExist = function (speakers, search) {
        if (search.firstname && search.lastname) {
            search = $scope.createSearchName(search);
        }

        return $scope.getSpeakerBySearchName(speakers, search).length == 0;
    };

    $scope.addSpeaker = function () {
        var model = $scope.model,
            searchName = model.searchSpeakerName;

        if (searchName && $scope.speakerWithSearchNameDoesNotExist(model.talk.speakers, searchName)) {
            UserService.getSpeakerBySearchName(searchName)
                .success(function (data, status, headers, config) {
                    // This service returns also returns users where the searchName is a partial match.
                    // So we need to be prepared for unexpected/multiple results
                    var results = data.results;
                    var speakersFromServer = $scope.getSpeakerBySearchName(results, searchName);
                    if (speakersFromServer.length == 1) {
                        var speakerFromServer = speakersFromServer[0];
                        var searchNameFromServer = $scope.createSearchName(speakerFromServer);

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
                }).error(function (data, status, headers, config) {
                    console.log(data)
                });
        }
    };

    $scope.addNewSpeaker = function (speaker) {
        speaker.unknown = true;
        $scope.model.talk.speakers.push(angular.copy(speaker));
        speaker.email = '';
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
            if (talk.tags.length < 3 || talk.tags.length > 8) {
                valid = false;
                submitProposalForm.addTag.$valid = false;
                submitProposalForm.addTag.$error = { 'range': !valid };
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
            Talks.post(talk)
                .success(function () {
                    console.log('post success');
                    $location.path('/speaker/proposals');
                }).error(function (error) {
                    console.log('post error');
                    $scope.isSubmitted = false;
                });
        }
    };
    $scope.cancel = function (talk) {
        $scope.model.talk = {};
        $location.url('/speaker/proposals')
    };
});
