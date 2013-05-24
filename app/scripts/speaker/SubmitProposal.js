
speakerModule.controller(speakerCtrlPrefix + 'SubmitProposalCtrl', function($scope, UserService, Tags, Talks, TalksService, EventService, $routeParams) {
    $scope.model = {
        speakerDetails: {},
        addSpeakerDialogOpen: false,
        newTag: '',
        opts: {
            backdropFade: true,
            dialogFade: true
        },
        currentUser: null
    };

    $scope.initializeForAdd = function() {
        $scope.model.talk = {
            state: 'DRAFT',
            tags: [],
            speakers: []
        };
    };

    $scope.initializeForEdit = function(proposalId) {
        TalksService.byId(proposalId).success(function(data, status, headers, config) {
//            data.event = $scope.global.events()[0];
            $scope.model.talk = data;
            console.log('event', $scope.model.talk.event)
        }).error(function(data, status, headers, config) {
            console.log(data)
        });
    };

    if ($routeParams.proposalId) {
        $scope.isNew = false;
        $scope.initializeForEdit($routeParams.proposalId);
    } else {
        $scope.isNew = true;
        $scope.initializeForAdd();
    }

    UserService.waitForCurrentUser().then(function(data) {
        if ($scope.isNew) {
            $scope.model.talk.speakers.push(data);
        }
        $scope.model.currentUser = data;
    });

    $scope.$watch(EventService.getEvents, function(newValue, oldValue) {
        if (newValue !== oldValue) {
            if ($scope.isNew) {
                if ($scope.global && $scope.global.events() && $scope.global.events().length == 1) {
                    $scope.model.talk.event = $scope.global.events()[0];
                }
            }
        }
    });

    $scope.getTags = function(partialTagName) {
        return Tags.query(partialTagName);
    };

    $scope.filterTagNames = function(tags) {
        if (tags) {
            return $.map(tags, function(tag) {
                return tag && tag.name;
            });
        }
        return [];
    };

    $scope.addTag = function() {
        var model = $scope.model;
        var tags = model.talk.tags;
        if (model.newTag
         && this.filterTagNames(tags).indexOf(model.newTag) == -1) {
            Tags.query(model.newTag).then(function(data) {
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

    $scope.createAvatarUrl = function(id, imageFile) {
        if (id && imageFile && imageFile.length) {
            return 'http://devoxxcfp.s3.amazonaws.com/images/' + id + '/' + imageFile;
        } else {
            return '/images/no_avatar.gif';
        }
    };

    $scope.addSpeaker = function() {
        var model = $scope.model,
            email = model.speakerDetails.email;
        var getSpeakerEmails = function(speakers) {
            if (speakers) {
                return $.map(speakers, function(speaker) {
                    return speaker && speaker.email;
                });
            }
            return [];
        };
        var speakerDoesNotExist = function(speakers, email) {
            var speakerEmails = getSpeakerEmails(speakers);
            return speakerEmails.indexOf(email) == -1
        };

        var filterByExactEmailAddress = function(results, email) {
            var ret = [];
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                if (result.email && result.email === email) {
                    ret.push(result);
                }
            }
            return ret;
        };

        if (email
         && speakerDoesNotExist(model.talk.speakers, email)) {
            UserService.getSpeakerByEmailAddress(email)
                .success(function(data, status, headers, config) {
                    // This service returns also returns users where the email address is a partial match.
                    // So we need to be prepared for unexpected/multiple results
                    var results = filterByExactEmailAddress(data.results, email);
                    if (results.length != 0) {
                        if (speakerDoesNotExist(model.talk.speakers, results[0].email)) {
                            model.talk.speakers.push(results[0]);
                            model.speakerDetails.email = '';
                        }
                    } else {
                        model.addSpeakerDialogOpen = true;
                        model.speakerDetails = {
                            email: email,
                            twitterHandle: '@'
                        };
                    }
                }).error(function(data, status, headers, config) {
                    console.log(data)
                });
        }
    };

    $scope.addNewSpeaker = function(speaker) {
        speaker.unknown = true;
        $scope.model.talk.speakers.push(angular.copy(speaker));
        speaker.email = '';
        $scope.model.addSpeakerDialogOpen = false;
    };

    $scope.closeNewSpeaker = function(speaker) {
        $scope.model.addSpeakerDialogOpen = false;
    };

    $scope.isFormValid = function(talk, submitProposalForm) {
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

    $scope.submit = function(talk, submitProposalForm) {
        if (!this.isFormValid(talk, submitProposalForm)) {
            return;
        }
        if ($scope.isNew) {
            Talks.post(talk)
                .success(function() {
                    console.log('post success');
                }).error(function(error) {
                    console.log('post error');
                });
        } else {
            Talks.put(talk).success(function(resource) {
                console.log('put success');
            }, function(error) {
                console.log('put error');
            });
        }
    };
    $scope.cancel = function(talk) {
        $scope.model.talk = {};
    };
});
