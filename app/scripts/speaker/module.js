'use strict';

var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId + '_',
    speakerModule = angular.module(speakerModuleId, [ 'GenericServices', 'ngCookies', 'ui.bootstrap' ]);

speakerModule.value('appName', 'Speaker Module', []);

speakerModule.config(function ($routeProvider) {
    var resolveCurrentUser = {
        currentUser: 'ResolverService'
    };
    // Proposal routing
    $routeProvider
        .when(speakerUrlPrefix + '/profile', {
            templateUrl: speakerViewPrefix + '/profile.html',
            controller: speakerCtrlPrefix + 'EditProfileCtrl'
        }).when(speakerUrlPrefix + '/proposals', {
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
}).factory('ResolverService', ['$q', 'UserService', function ($q, UserService) {
    var defer = $q.defer();
    UserService.waitForCurrentUser().then(function(data) {
        if (UserService.isProfileComplete(data)) {
            defer.resolve(data);
        } else {
            defer.reject('Profile incomplete');
        }
    }, function(data) {
        defer.reject(data);
    });
    return defer.promise;
}]);
