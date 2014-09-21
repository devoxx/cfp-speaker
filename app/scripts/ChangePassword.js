"use strict";

cfpSpeakerApp.controller('ChangePasswordCtrl', ['$scope', 'AnonymousService', '$routeParams', function($scope, AnonymousService, $routeParams) {

    $scope.model = { 
        newUser: {}
    };

    $scope.feedback = null;

    $scope.passwordsMatch = function(){
        return ($scope.model.newUser.password && $scope.model.newUser.password.length > 3 && $scope.model.newUser.password == $scope.model.newUser.password2) || false;
    };

    $scope.changePassword = function() {
        
        if ($scope.passwordsMatch) {

            AnonymousService.changePassword($routeParams.token, $scope.model.newUser.password)

                .success(function () {
                    $scope.feedback = {
                        type: 'info',
                        message: 'Your password was changed successfully, please login again.'
                    }

                })
                .error(function () {
                    $scope.feedback = {
                        type: 'error',
                        message: 'Failed to change your password, please try to reset your password again.'
                    }
                });

        }

    };
}]);
