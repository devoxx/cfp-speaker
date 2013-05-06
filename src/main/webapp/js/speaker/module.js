var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId  + '_',
    speakerModule = angular.module(speakerModuleId, []);

speakerModule.value('appName', 'Speaker Module', ['Generic Services']);

speakerModule.config(function($routeProvider) {
    // Speaker routing
    $routeProvider
        .when(speakerUrlPrefix, {
            templateUrl: speakerViewPrefix + '/home.html',
            controller: speakerCtrlPrefix + 'HomeCtrl'
        }).when(speakerUrlPrefix + '/my_talks', {
            templateUrl: speakerViewPrefix + '/my_talks.html',
            controller: speakerCtrlPrefix + 'MyTalksCtrl'
        }).when(speakerUrlPrefix + '/submit_talk', {
            templateUrl: speakerViewPrefix + '/submit_talk.html',
            controller: speakerCtrlPrefix + 'SubmitTalkCtrl'
        }).when(speakerUrlPrefix + '/talk_details/:talkId', {
            templateUrl: speakerViewPrefix + '/talk_details.html',
            controller: speakerCtrlPrefix + 'TalkDetailsCtrl'
        });
});

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

speakerModule.controller(speakerCtrlPrefix + 'SubmitTalkCtrl', function($scope, UsersService, Tags, EventBus) {
    $scope.model = {
        talk: {
            tagNames: [],
            speakers: []
        },
        newSpeaker: {},
        addSpeakerDialogOpen: false,
        newTag: '',
        opts: {
            backdropFade: true,
            dialogFade:true
        },
        currentSpeaker: UsersService.getCurrentUser(),
        onBehalfOf: false
    };

    EventBus.onEventsLoaded($scope, function(events, event) {
        if (events.length == 1) {
            $scope.model.event = events[0];
        }
    });

    $scope.getTags = function(partialTagName) {
        return Tags.query(partialTagName);
    };
    $scope.addTag = function() {
        var model = $scope.model;
        var tagNames = model.talk.tagNames;
        if (model.newTag
         && tagNames.indexOf(model.newTag) == -1) {
            Tags.query(model.newTag).then(function(data) {
                tagNames.push(model.newTag);
                model.newTag = '';
            });
        }
    };

    $scope.addSpeaker = function() {
        var model = $scope.model;
        var speakerEmails = $.map($scope.model.talk.speakers, function(speaker) {
            return speaker.email;
        });
        if (model.newSpeaker.email
         && speakerEmails.indexOf(model.newSpeaker.email) == -1) {
            UsersService.getSpeakerByEmailAddress(model.newSpeaker.email).then(function(data) {
                model.talk.speakers.push(data);
                model.newSpeaker.email = '';
            }, function(reason) {
                model.addSpeakerDialogOpen = true;
                model.newSpeaker = {
                    email: model.newSpeaker.email
                };
            });
        }
    };

    $scope.addNewSpeaker = function(speaker) {
        speaker.unknown = true;
        $scope.model.talk.speakers.push(angular.copy(speaker));
        speaker.email = '';
        $scope.model.addSpeakerDialogOpen = false;
    };

//    $scope.openSpeakerModal = function() {
//        $scope.model.addSpeakerOpen = true;
//    };
//    $scope.closeSpeakerModal = function() {
//        $scope.model.addSpeakerOpen = false;
//    };
//    $scope.removeSpeaker = function(speaker) {
//        var speakers = $scope.model.talk.speakers;
//        speakers.splice(speakers.indexOf(speaker), 1);
//    };
//    $scope.addNewTag = function(newTag, tags, isValid) {
//        if (!isValid || newTag=='') {
//            return;
//        }
//        tags.push(newTag);
//        $scope.model.newTag = '';
//    };
//    $scope.removeTag = function(tag) {
//        var tags = $scope.model.talk.tags;
//        tags.splice(tags.indexOf(tag), 1);
//    };
//    $scope.contains = function(searchString, searchTerm) {
//        return searchString.indexOf(searchTerm) != -1;
//    }
//    $scope.toggleTag = function(tag) {
//        $scope.model.talk.tags.push(tag)
//    }
});

speakerModule.controller(speakerCtrlPrefix + 'TalkDetailsCtrl', function($scope, $routeParams, TalksService) {
    $scope.model = {
        talk: TalksService.byId($routeParams.talkId)
    };
});

speakerModule.controller(speakerCtrlPrefix + 'GlobalCtrl', function($scope, $timeout, UsersService, Events, EventBus) {
    $scope.global = {};
    $scope.global.events = Events.query();
    $scope.global.events.$then(function() {
        for (var i = 0; i < $scope.global.events.length; i++) {
            var event = $scope.global.events[i];
            event.tracks = [];
            event.tracks.push({name: event.name + ' Web'});
            event.tracks.push({name: event.name + ' Java'});
            event.tracks.push({name: event.name + ' Future<Devoxx>'});
            event.tracks.push({name: event.name + ' Architecture & Security'});
            event.tracks.push({name: event.name + ' NoSQL & Big Data'});
            event.tracks.push({name: event.name + ' Methodology'});
            event.types = [];
            event.types.push({name: 'Conference'})
            event.types.push({name: 'Hands on Labs'})
            event.types.push({name: 'University'})
            event.types.push({name: 'BOF'})
        }
        $scope.global.events.splice(1, 1);
        EventBus.eventsLoaded($scope.global.events);
    });

    $scope.global.speakers = UsersService.getAllSpeakers();
});

