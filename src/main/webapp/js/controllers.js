// Injecting rootScope only allowed in AppCtrl, because of handling routing errors
app.controller('AppCtrl', function($rootScope, $route) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        console.log('$routeChangeError:', event, current, previous, rejection);
    });
    $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
        console.log('$routeChangeStart', event, current, previous, rejection);
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous, rejection) {
        console.log('$routeChangeSuccess', event, current, previous, rejection);
    });
    console.log($route.routes)
});

app.controller('LoginCtrl', function($scope, $location) {
    $scope.loginUser = {};
    $scope.login = function(type) {
        console.log(type)
        $location.path('/' + type);
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
