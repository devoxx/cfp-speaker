"use strict";

cfpSpeakerAppModule.controller('LostPasswordCtrl', ['$scope', 'AnonymousService', function($scope, AnonymousService) {
    $scope.model = {};

    $scope.initLostPasswordForm = function() {
        $scope.model.email = '';
        $scope.error = '';
        $scope.isSubmitting = false;
        $scope.isSubmitted = false;
    };

    $scope.initLostPasswordForm();

    $scope.lostPassword = function() {
        $scope.isSubmitting = true;
        AnonymousService.lostPassword($scope.model.newUser).then(function(data) {
            $scope.initLostPasswordForm();
            $scope.isSubmitted = true;
        }, function(data) {
            $scope.isSubmitting = false;
            console.log('Error resetting password', data);
            $scope.error = 'There was an error. Please check the information you entered and try again';
        });
    };
}]);
