'use strict';

// Injecting rootScope only allowed in AppCtrl, because of handling routing errors
app.controller('AppCtrl', function($rootScope, $route, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        console.log('$routeChangeError:', arguments);
        if (rejection === 'No valid userToken') {
            $location.path('/login');
        }
    });
    $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
        console.log('$routeChangeStart', arguments);
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous, rejection) {
        console.log('$routeChangeSuccess', arguments);
    });
    $rootScope.$on('$viewContentLoaded', function(event, current, previous, rejection) {
        console.log('$viewContentLoaded', arguments);
    });
});

app.controller('LoginCtrl', function($scope, $location, $cookies, $http, $filter, UserService) {
    $scope.model = {};
    $scope.login = function() {
        UserService.login($scope.model.email, $scope.model.password);
    };
    console.log(UserService.waitLoggedIn)
    UserService.waitLoggedIn().then(function(data) {
        console.log('data', data)
        $scope.currentUser = data;
    });
//    console.log($scope.currentUser)
    $scope.logout = UserService.logout;
//    UserService.waitLoggedIn().then(function(data) {
//        $scope.currentUser = data;
//        console.log('done')
//        $location.path('/home')
//    });
});

app.controller('NavigationCtrl', function($scope, $cookies, $location) {
    $scope.logout = function() {
        $cookies.userToken = '';
        $location.path('/');
    };
});

app.controller('ProfileCtrl', function($scope, UserService) {
    $scope.model = {};
    UserService.waitLoggedIn().then(function(){
        $scope.model.speakerDetails = UserService.getCurrentUser();
    });
    $scope.profileComplete = UserService.profileComplete;

    $scope.updateProfile = function() {
        UserService.updateProfile($scope.model.speakerDetails);
    };
});


app.controller('HomeCtrl', function($scope, $location) {
    $scope.loginUser = {};
    $scope.login = function(type) {
        $location.path('/type');
    };
});

app.controller('ContactCtrl', function($scope, $location) {
    $scope.loginUser = {};
    $scope.login = function(type) {
        $location.path('/type');
    };
});

app.controller('AboutCtrl', function($scope, $location) {
    $scope.loginUser = {};
    $scope.login = function(type) {
        $location.path('/type');
    };
});

app.controller('TwitterCtrl', function($scope, $location) {
    $scope.tweets = [
        {
            thumbnail: 'images_dummy/tweeter_dummy.jpg',
            name: '',
            tweet: '1 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
            handle: '@Lialee',
            time: '30 minutes ago'
        },
        {
            thumbnail: 'images_dummy/tweeter_dummy.jpg',
            name: '',
            tweet: '2 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
            handle: '@Lialee',
            time: '30 minutes ago'
        },
        {
            thumbnail: 'images_dummy/tweeter_dummy.jpg',
            name: '',
            tweet: '3 I was wondering who is going tonight to the #devoxx seminar in Brussels? Anyone has a ticket left over?',
            handle: '@Lialee',
            time: '30 minutes ago'
        }
    ];
});