'use strict';

genericServices.factory('ContactService',function ($http) {
    return {
        send: function (contactInfo) {
            return $http.post(contactUri, contactInfo);
        }
    };
});
