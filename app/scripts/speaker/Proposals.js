'use strict';

speakerModule.controller(speakerCtrlPrefix + 'ProposalsCtrl', function ($scope, $location, TalksService, EventService) {
    $scope.model = {
        event: null,
        myProposals: null,
        events: EventService.getEvents()
    };

    TalksService.allProposalsForUser().success(function (data, status, headers, config) {
        $scope.model.myProposals = data;
    }).error(function (data, status, headers, config) {
            console.log(data);
        });

    $scope.editProposal = function (proposal) {
        $location.path('/speaker/proposal/' + proposal.id);
    };

    $scope.deleteProposal = function (proposal) {
        if (confirm('Are you sure you want to delete this proposal? This cannot be undone!')) {
            TalksService.deleteProposal(proposal);
        }
    }
});
