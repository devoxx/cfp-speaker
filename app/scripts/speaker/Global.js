
speakerModule.controller(speakerCtrlPrefix + 'GlobalCtrl', function($scope, $timeout, $q, UserService, EventService, EventBus) {
    $scope.global = {};

    $scope.global.events = EventService.getEvents;

    $scope.global.experienceOptions = [
        'NOVICE',
        'MEDIOR',
        'SENIOR'
    ];
    $scope.global.languageOptions = [
        { id: '1', label: 'EN'},
        { id: '2', label: 'FR'},
        { id: '3', label: 'NL'}
    ];
});
