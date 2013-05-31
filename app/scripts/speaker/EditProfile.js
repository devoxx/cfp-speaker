'use strict';

speakerModule.controller(speakerCtrlPrefix + 'EditProfileCtrl',function ($scope, UserService) {
    $scope.model = {
        updating: false
    };
    var model = $scope.model;

    $scope.profileComplete = true;
    UserService.waitForCurrentUser().then(function(){
        model.speakerDetails = angular.copy(UserService.currentUser);
        $scope.profileComplete = UserService.isProfileComplete(model.speakerDetails);
    });

    $scope.updateProfile = function () {
        model.updating = true;
        UserService.updateProfile(model.speakerDetails).then(function(data) {
            model.updating = false;
        });
    };
});
