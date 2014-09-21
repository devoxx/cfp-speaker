"use strict";

cfpSpeakerApp.controller('RegisterCtrl', ['$scope', 'AnonymousService', 'UserService', '$location',
                                        function($scope, AnonymousService, UserService, $location) {

    $scope.model = {};

    $scope.model.newUser = {};

    $scope.feedback = null;

    $scope.hasNoTypo = function() {
        return $scope.emailsMatch() && $scope.passwordsMatch();
    }

    $scope.emailsMatch = function(){
        return ($scope.model.newUser.email && $scope.model.newUser.email.length > 3 && $scope.model.newUser.email == $scope.model.newUser.email2) || false;
    }

    $scope.passwordsMatch = function(){
        return ($scope.model.newUser.password && $scope.model.newUser.password.length > 3 && $scope.model.newUser.password == $scope.model.newUser.password2) || false;
    }

    $scope.register = function() {

            if ($scope.hasNoTypo()) {
                
                $scope.feedback = null;

                AnonymousService.registerUser({
                    firstname:  $scope.model.newUser.firstname,
                    lastname:   $scope.model.newUser.lastname,
                    username:   $scope.model.newUser.username,
                    email:      $scope.model.newUser.email,
                    password:   $scope.model.newUser.password
                })
                    .success(function () {
                        $scope.feedback = {
                            type: 'info',
                            message: 'Your account was created'
                        }
                        UserService.login($scope.model.newUser.username, $scope.model.newUser.password)
                            .then(function(){
                                $location.path('/speaker/profile');
                            })
                    })
                    .error(function (data) {
                        $scope.feedback = {
                            type: 'error',
                            message: 'Failed to register: ' + data.msg
                        }
                    });
            }

        }


}]);
