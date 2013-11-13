angular.module('VotingService', []).factory('VotingService', ['$http', function($http) {

    return {
        topOfWeek: function(callback) {
            $http.get("http://172.19.0.40:3000/bestofweek").success(function(data, status, headers, config) {
                callback(null, data);
            }).error(function(data, status, headers, config) { callback(new Error(status), null)});
        },
        topOfToday : function(callback) {
            $http.get("http://172.19.0.40:3000/bestoftoday").success(function(data, status, headers, config) {
                callback(null, data);
            }).error(function(data, status, headers, config) { callback(new Error(status), null)});
        }
    }
}] );
