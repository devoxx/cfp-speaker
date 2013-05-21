
speakerModule.controller(speakerCtrlPrefix + 'ProposalDetailsCtrl', function($scope, $routeParams, TalksService) {
    $scope.model = {
        talk: TalksService.byId($routeParams.eventId, $routeParams.proposalId)
    };
});
