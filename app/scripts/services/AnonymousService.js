'use strict';

genericServices.factory('AnonymousService', ['$http', '$q' ,function($http, $q) {
    return {
        registerUser: function(user) {
            var url = authUri + '/register';

            return $http.post(url, user);
        },
        lostPassword: function(email) {
            var url = authUri + '/reset/' + email;

            return $http.post(url, {});
        },
        changePassword: function(token, password) {
            var url = authUri + '/change';

            return $http.post(url, { uuid: token, password: password });
        }
    };
}])
