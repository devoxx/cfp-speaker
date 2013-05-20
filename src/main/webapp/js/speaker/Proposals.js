
speakerModule.controller(speakerCtrlPrefix + 'ProposalsCtrl', function($scope, $location, TalksService, EventService) {
    $scope.model = {
        event: null,
        myProposals: [],
        events: EventService.getEvents
    };

    $scope.getProposals = function(event) {
        if (event) {
            TalksService.allProposalsForEvent(event.id).then(function(http) {
                console.log('http', http.data)
                $scope.model.myProposals = http.data;
            });
        }
        $scope.model.myProposals = null;
    };

    $scope.showDetails = function(proposal) {
        $location.path('/speaker/proposal/' + $scope.model.event.id + '/' + proposal.id);
    };

    $scope.deleteProposal = function(proposal) {
        alert('Currently not supported. Please contact the steering committee for proposal deletion');
    }
});
