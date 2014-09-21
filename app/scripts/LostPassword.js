"use strict";

cfpSpeakerApp.controller('LostPasswordCtrl', ['$scope', 'AnonymousService', function($scope, AnonymousService) {
    $scope.model = { email : null };

    $scope.lostPassword = function() {
        
        AnonymousService.lostPassword($scope.model.email)

            .success(function () {
                $scope.feedback = {
                    type: 'info',
                    message: 'An email with instructions on how to reset your password has been sent to the provided email address.'
                }

            })
            .error(function () {
                $scope.feedback = {
                    type: 'error',
                    message: 'We couldn\'t find your email address in our systems. Please your input and try again'
                }
            });

    };
}]);
