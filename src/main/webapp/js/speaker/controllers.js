'use strict';

var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId  + '_',
    speakerModule = angular.module(speakerModuleId, [ 'GenericServices', 'ngCookies' ]);

speakerModule.value('appName', 'Speaker Module', []);

speakerModule.config(function($routeProvider) {
    var resolveCurrentUser = {
        currentUser: speakerModule.resolveCurrentUser
    };
    // Speaker routing
    $routeProvider
        .when(speakerUrlPrefix + '/proposals', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/my_talks.html',
            controller: speakerCtrlPrefix + 'MyTalksCtrl'
        }).when(speakerUrlPrefix + '/proposal/new', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/submit_talk.html',
            controller: speakerCtrlPrefix + 'SubmitTalkCtrl'
        }).when(speakerUrlPrefix + '/proposal/:talkId', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/talk_details.html',
            controller: speakerCtrlPrefix + 'TalkDetailsCtrl'
        });
});

speakerModule.resolveCurrentUser = function(UserService) {
    return UserService.waitLoggedIn();
};

speakerModule.controller(speakerCtrlPrefix + 'HomeCtrl', function($scope) {
});

speakerModule.controller(speakerCtrlPrefix + 'MyTalksCtrl', function($scope, $location, TalksService) {
    $scope.model = {
        myTalks: TalksService.allTalksForSpeaker({ id: 9}) // TODO FIXME event ID
    };
    $scope.showDetails = function(talk) {
        $location.path('/speaker/proposal/'+talk.id);
    };
});

speakerModule.controller(speakerCtrlPrefix + 'SubmitTalkCtrl', function($scope, $route, UserService, Tags, Talks, EventService) {
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
        currentUser: UserService.getCurrentUser(),
        onBehalfOf: false
    };

    $scope.$watch(EventService.getEvents, function(){
        console.log("Event fired " + EventService.getEvents());
        if ($scope.global && $scope.global.events() && $scope.global.events().length == 1) {
            $scope.model.talk.event = $scope.global.events()[0];
        }
    })

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
            UserService.getSpeakerByEmailAddress(email)
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

speakerModule.controller(speakerCtrlPrefix + 'GlobalCtrl', function($scope, $timeout, $q, UserService, EventService, EventBus) {
    $scope.global = {};

    $scope.global.events = EventService.getEvents;

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

