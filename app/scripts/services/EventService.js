'use strict';

genericServices.factory('EventService',function ($http, $q, $filter, UserService) {
    var eventService = {
        eventsDefer: $q.defer(),
        load: function () {
            var url = proposalUri + '/event';
            return $http.get(url, {
                params: {
                    userToken: UserService.getToken()
                }
            }).success(function (result, status, headers, config) {
                    var list = result;
                    list = $filter('orderBy')(list, function (o) {
                        return o.cfpTo;
                    });
                    eventService.eventsDefer.resolve(list);
                }).error(function (result, status, headers, config) {
                    eventService.eventsDefer.reject(result);
                });
        },
        getEvents: function () {
            UserService.waitForCurrentUser().then(function () {
                eventService.load();
            });
            return eventService.eventsDefer.promise;
        }
    };
    return eventService;
});
