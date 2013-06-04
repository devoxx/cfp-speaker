'use strict';

speakerModule.controller(speakerCtrlPrefix + 'EditProfileCtrl',function ($scope, UserService) {
    $scope.model = {
        
    };
    var model = $scope.model;

    $scope.feedback = null;
    $scope.profileComplete = false;

    UserService.waitForCurrentUser().then(function(){
        model.speakerDetails = angular.copy(UserService.currentUser);
        $scope.profileComplete = UserService.isProfileComplete(model.speakerDetails);
    });

    $scope.thumbnailUrl = function () {
        return UserService.thumbnailUrl($scope.model.speakerDetails);
    }

    $scope.updateProfile = function () {
        
        UserService.updateProfile(model.speakerDetails).success(function(){
            $scope.profileComplete = UserService.isProfileComplete(model.speakerDetails);

            $scope.feedback = {
                type: 'info',
                message: 'Profile saved'
            }

        }).error(function(){

            $scope.feedback = {
                type: 'error',
                message: 'Failed to update your profile, please try again'
            }

        });
    };
});
