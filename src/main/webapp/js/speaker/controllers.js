'use strict';

var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId  + '_',
    speakerModule = angular.module(speakerModuleId, [ 'Generic Services', 'ngCookies' ]);

speakerModule.value('appName', 'Speaker Module', []);

speakerModule.config(function($routeProvider) {
    var resolveCurrentUser = {
        currentUser: speakerModule.resolveCurrentUser
    };
    // Speaker routing
    $routeProvider
        .when(speakerUrlPrefix, {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/home.html',
            controller: speakerCtrlPrefix + 'HomeCtrl'
        }).when(speakerUrlPrefix + '/my_talks', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/my_talks.html',
            controller: speakerCtrlPrefix + 'MyTalksCtrl'
        }).when(speakerUrlPrefix + '/submit_talk', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/submit_talk.html',
            controller: speakerCtrlPrefix + 'SubmitTalkCtrl'
        }).when(speakerUrlPrefix + '/talk_details/:talkId', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/talk_details.html',
            controller: speakerCtrlPrefix + 'TalkDetailsCtrl'
        });

});

speakerModule.resolveCurrentUser = function($q, UsersService) {
    var defer = $q.defer();
    var currentUserHttp = UsersService.getCurrentUser();
    currentUserHttp.then(function(data, status, headers, config) {
        if (data) {
            defer.resolve(data);
        } else {
            defer.reject("No valid userToken");
        };
    }, function(data, status, headers, config) {
        defer.reject("No valid userToken");
    });
    return defer.promise;
};

speakerModule.controller(speakerCtrlPrefix + 'HomeCtrl', function($scope) {
});

speakerModule.controller(speakerCtrlPrefix + 'MyTalksCtrl', function($scope, $location, TalksService) {
    $scope.model = {
        myTalks: TalksService.allTalksForSpeaker()
    };
    $scope.showDetails = function(talk) {
        $location.path('/speaker/talk_details/'+talk.id);
    };
});

speakerModule.controller(speakerCtrlPrefix + 'SubmitTalkCtrl', function($scope, $route, UsersService, Tags, Talks, EventBus) {
    $scope.model = {
        talk: {
            tags: [],
            speakers: [
                $route.current.locals.currentUser
            ]
        },
        speakerDetails: {},
        addSpeakerDialogOpen: false,
        newTag: '',
        opts: {
            backdropFade: true,
            dialogFade:true
        },
        currentUser: UsersService.getCurrentUser(),
        onBehalfOf: false
    };

    EventBus.onEventsLoaded($scope, function(events, event) {
        if (events.length == 1) {
            $scope.model.talk.event = events[0];
        }
    });

    $scope.getTags = function(partialTagName) {
        return Tags.query(partialTagName);
    };
    $scope.addTag = function() {
        var model = $scope.model;
        var tags = model.talk.tags;
        if (model.newTag
         && tags.indexOf(model.newTag) == -1) {
            Tags.query(model.newTag).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    var tag = data[i];
                    if (tag.name == model.newTag) {
                        console.log(tag)
                        tags.push(tag);
                        break;
                    }
                }
                model.newTag = '';
            });
        }
    };

    $scope.addSpeaker = function() {
        var model = $scope.model,
            email = model.speakerDetails.email;
        var getSpeakerEmails = function(speakers) {
            return $.map(speakers, function(speaker) {
                return speaker.email;
            });
        };
        var speakerDoesNotExist = function(speakers, email) {
            return getSpeakerEmails(speakers).indexOf(email) == -1
        };
        if (email
         && speakerDoesNotExist(model.talk.speakers, email)) {
            UsersService.getSpeakerByEmailAddress(email)
                .success(function(data, status, headers, config) {
                    var results = data.results;
                    if (results.length != 0) {
                        if (speakerDoesNotExist(model.talk.speakers, email)) {
                            console.log('pushing')
                            model.talk.speakers.push(results[0]);
                            model.speakerDetails.email = '';
                        }
                    } else {
                        model.addSpeakerDialogOpen = true;
                        model.speakerDetails = {
                            email: email
                        };
                    }
                }).error(function(data, status, headers, config) {
                    console.log(reason)
                });
        }
    };

    $scope.addNewSpeaker = function(speaker) {
        speaker.unknown = true;
        $scope.model.talk.speakers.push(angular.copy(speaker));
        speaker.email = '';
        $scope.model.addSpeakerDialogOpen = false;
    };

    $scope.submit = function(talk) {
        if (this.isNew(talk)) {
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
    $scope.isNew = function(talk) {
        return typeof(talk.id) === 'undefined';
    };
    $scope.cancel = function(talk) {
        $scope.model.talk = {};
    };
});

speakerModule.controller(speakerCtrlPrefix + 'TalkDetailsCtrl', function($scope, $routeParams, TalksService) {
    $scope.model = {
        talk: TalksService.byId($routeParams.talkId)
    };
});

speakerModule.controller(speakerCtrlPrefix + 'GlobalCtrl', function($scope, $timeout, $q, UsersService, Events, EventBus) {
    $scope.global = {};
    $scope.global.events = Events.query();
    $scope.global.events.$then(function() {
        for (var i = 0; i < $scope.global.events.length; i++) {
            var event = $scope.global.events[i];
            var e = Events.get({eventId: event.id})
            e.$then(function (ee) {
                return function(resource) {
                    var event = resource.data;
                    ee.tracks = event.tracks;
                    ee.types = event.types;
                };
            }(event),
            function(error) {
                console.log('Error: ' + error)
            });
        }
        $scope.global.events.splice(2, 1);
        $scope.global.events.splice(0, 1);
        EventBus.eventsLoaded($scope.global.events);
    });
    $scope.global.experienceOptions = [
        'NOVICE',
        'MEDIOR',
        'SENIOR'
    ];
    $scope.global.languageOptions = [
        { id: '1', label: 'EN'},
        { id: '2', label: 'FR'},
        { id: '3', label: 'NL'}
    ];
});

