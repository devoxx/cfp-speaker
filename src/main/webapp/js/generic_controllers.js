'use strict';

// Injecting rootScope only allowed in AppCtrl, because of handling routing errors
app.controller('AppCtrl', function($rootScope, $route, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        console.log('$routeChangeError:', event, current, previous, rejection);
        if (rejection === 'No valid userToken') {
            $location.path('/login');
        }
    });
    $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
        console.log('$routeChangeStart', event, current, previous, rejection);
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous, rejection) {
        console.log('$routeChangeSuccess', event, current, previous, rejection);
    });
});
app.controller('LoginCtrl', function($scope, $location, $cookies, $http, $filter) {
    $scope.model = {};
    $scope.model.email = 'jankeesvanandel@gmail.com';
    $scope.model.password = '';
    $scope.login = function() {
        var url = authBaseUri + '/login';
        $http.post(url, {}, {
            params: {
                login: $scope.model.email,
                password: $scope.model.password
            }
            }).success(function(data, status, headers, config) {
                var newestLoginToken = $filter('orderBy')(data.loginTokens, function(t) { return t.expires; })[0];
                $cookies.userToken = newestLoginToken.token;
                $location.path('profile')
            }).error(function(data, status, headers, config) {
                $scope.model.loggedInUser = null;
            });
    };
});
app.controller('NavigationCtrl', function($scope, $cookies, $location) {
    $scope.logout = function() {
        $cookies.userToken = '';
        $location.path('/');
    };
});
app.controller('ProfileCtrl', function($scope, UsersService) {
    $scope.model = {};
    $scope.model.speakerDetails = UsersService.getCurrentUser();
    $scope.profileComplete = function() {
        return false;
    };
    $scope.updateProfile = function(speakerDetails) {
        // Update profile
        if (success) {
            $scope.model.loggedInUser = angular.copy($scope.model.speakerDetails);
        }
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
