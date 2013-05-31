"use strict";

cfpSpeakerAppModule.controller('RegisterCtrl', ['$scope', 'AnonymousService', function($scope, AnonymousService) {
    $scope.model = {};

    $scope.initRegisterForm = function() {
        $scope.model.newUser = {};
        $scope.isSubmitting = false;
        $scope.isSubmitted = false;
        $scope.error = null;
    };

    $scope.initRegisterForm();

    $scope.register = function() {
        $scope.isSubmitting = true;
        AnonymousService.registerUser($scope.model.newUser).then(function(data) {
            $scope.initRegisterForm();
            $scope.isSubmitted = true;
        }, function(data) {
            $scope.isSubmitting = false;
            console.log('Error registering user', data);
            $scope.error = 'There was an error. Please check the information you entered and try again';
        });
    };
}]);
