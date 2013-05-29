'use strict';

var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId + '_',
    speakerModule = angular.module(speakerModuleId, [ 'GenericServices', 'ngCookies', 'ui.bootstrap' ]);

speakerModule.value('appName', 'Speaker Module', []);

speakerModule.config(function ($routeProvider) {
    var resolveCurrentUser = {
        currentUser: speakerModule.resolveCurrentUser
    };
    // Proposal routing
    $routeProvider
        .when(speakerUrlPrefix + '/proposals', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/proposals.html',
            controller: speakerCtrlPrefix + 'ProposalsCtrl'
        }).when(speakerUrlPrefix + '/proposal/', {
            redirectTo: '/proposals'
        }).when(speakerUrlPrefix + '/proposal/new', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/proposal_form.html',
            controller: speakerCtrlPrefix + 'SubmitProposalCtrl'
        }).when(speakerUrlPrefix + '/proposal/:proposalId', {
            resolve: resolveCurrentUser,
            templateUrl: speakerViewPrefix + '/proposal_form.html',
            controller: speakerCtrlPrefix + 'SubmitProposalCtrl'
        });
});

speakerModule.resolveCurrentUser = function (UserService) {
    return UserService.waitForCurrentUser();
};
