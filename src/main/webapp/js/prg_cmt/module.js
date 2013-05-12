var prgCmtModuleId = 'PrgCmt',
    prgCmtUrlPrefix = '/prg_cmt',
    prgCmtViewPrefix = 'views/prg_cmt',
    prgCmtCtrlPrefix = prgCmtModuleId  + '_',
    prgCmtModule = angular.module(prgCmtModuleId, []);

prgCmtModule.value('appName', 'Review Proposals');

prgCmtModule.config(function($routeProvider) {
    console.log('module prg_cmt config')
    // Programme Committee routing
    $routeProvider
        .when(prgCmtUrlPrefix, {
            templateUrl: prgCmtViewPrefix + '/home.html',
            controller: prgCmtCtrlPrefix + 'HomeCtrl'
        }).when(prgCmtUrlPrefix + '/talks/:event', {
            templateUrl: prgCmtViewPrefix + '/talks_for_event.html',
            controller: prgCmtCtrlPrefix + 'PrgCmt_TalksForEventCtrl'
        }).when(prgCmtUrlPrefix + '/talks/view_talk/:talk_id', {
            templateUrl: prgCmtViewPrefix + '/view_talk.html',
            controller: prgCmtCtrlPrefix + 'PrgCmt_ViewTalkCtrl'
        }).when(prgCmtUrlPrefix + '/wishlist', {
            templateUrl: prgCmtViewPrefix + '/wishlist.html',
            controller: prgCmtCtrlPrefix + 'PrgCmt_WishlistCtrl'
        });
});

prgCmtModule.controller(prgCmtCtrlPrefix + 'HomeCtrl', function($scope) {

});

prgCmtModule.controller(prgCmtCtrlPrefix + 'TalksForEventCtrl', function($scope) {

});

prgCmtModule.controller(prgCmtCtrlPrefix + 'ViewTalkCtrl', function($scope) {

});

prgCmtModule.controller(prgCmtCtrlPrefix + 'WishlistCtrl', function($scope) {

});
