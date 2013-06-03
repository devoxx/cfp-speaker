'use strict';

var speakerModuleId = 'Speaker',
    speakerUrlPrefix = '/speaker',
    speakerViewPrefix = 'views/speaker',
    speakerCtrlPrefix = speakerModuleId + '_',
    speakerModule = angular.module(speakerModuleId, [ 'GenericServices', 'ngCookies', 'ui.bootstrap' ]);

speakerModule.value('appName', 'Speaker Module', []);

speakerModule.config(function ($routeProvider) {
    var resolveUserWithProfile = {
        currentUser: 'UserWithProfileResolver'        
    };
    // Proposal routing
    $routeProvider
        .when(speakerUrlPrefix + '/profile', {
            resolve: { currentUser: 'UserResolver' },
            templateUrl: speakerViewPrefix + '/profile.html',
            controller: speakerCtrlPrefix + 'EditProfileCtrl'
        }).when(speakerUrlPrefix + '/proposals', {
            resolve: resolveUserWithProfile,
            templateUrl: speakerViewPrefix + '/proposals.html',
            controller: speakerCtrlPrefix + 'ProposalsCtrl'
        }).when(speakerUrlPrefix + '/proposal/', {
            redirectTo: '/proposals'
        }).when(speakerUrlPrefix + '/proposal/new', {
            resolve: resolveUserWithProfile,
            templateUrl: speakerViewPrefix + '/proposal_form.html',
            controller: speakerCtrlPrefix + 'SubmitProposalCtrl'
        }).when(speakerUrlPrefix + '/proposal/:proposalId', {
            resolve: resolveUserWithProfile,
            templateUrl: speakerViewPrefix + '/proposal_form.html',
            controller: speakerCtrlPrefix + 'SubmitProposalCtrl'
        });
}).factory('UserWithProfileResolver', ['$q', 'UserService', '$location', function ($q, UserService, $location) {
    var defer = $q.defer();
    UserService.waitForCurrentUserAndRequestLogin()
        .then(function(data) {
            if (!UserService.isProfileComplete(data)) {
                defer.reject('emptyprofile');
            } else {
                defer.resolve(data);
            }
        }, function(data) {
            defer.reject(data);
        });
    return defer.promise;
}]).factory('UserResolver', ['$q', 'UserService', '$location', function ($q, UserService, $location) {
    var defer = $q.defer();
    UserService.waitForCurrentUserAndRequestLogin()
        .then(function(data) {
            defer.resolve(data);
        }, function(data) {
            defer.reject(data);
        });
    return defer.promise;
}]);
