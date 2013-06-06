'use strict';

describe('Service: GenericServices', function () {

    var expectedBaseUri = 'https://staging-cfp.devoxx.com/v2/';
    var rootScope;

    beforeEach(module('cfpSpeakerApp'));

    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope;
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var TalksService,
        UserService,
        EventService,
        expected = {results: [
            {
                "expectedData": 123
            }
        ]
        };

    beforeEach(inject(function (_TalksService_, _UserService_, _EventService_) {
        EventService = _EventService_;
        TalksService = _TalksService_;
        UserService = _UserService_;
    }));

    it('should get all presentations for speaker', inject(function (TalksService, $httpBackend, $rootScope) {
        var result;
        $httpBackend.expectGET(new RegExp(expectedBaseUri + "proposal?")).respond(200, expected);

        TalksService.allProposalsForUser().then(function(data) {
            result = data.data;
        });

        $httpBackend.flush();

        waitsFor(function() {
            $rootScope.$digest(); // Digest loop triggers $evalAsync
            return !!result;
        }, 'Promise should have been resolved', 50);

        runs(function() {
            expect(result).toEqualData({
                results: [{
                    expectedData: 123
                }]
            });
        });
    }));

  it('should get all presentations by id', inject(function ($httpBackend) {

    $httpBackend.expectGET(new RegExp(expectedBaseUri + "proposal/123")).respond(expected);

    var actual = TalksService.byId(123);

    $httpBackend.flush();

    expect(actual).toBeDefined();
// TODO   expect(actual).toEqualData(expected);

   }));

  it('should allow a user to login', inject(function ($httpBackend) {

      var expected = { loginTokens: [ { token : "xyz"} ]};

      $httpBackend.expectPOST(expectedBaseUri + "auth?login=stephan&password=test").respond(expected);

      var actual = UserService.login("stephan", "test");

      $httpBackend.flush();

      expect(actual).toBeDefined();
// TODO     expect(actual).toEqualData(expected);

   }));

   it('should allow to get a speaker by email', inject(function ($httpBackend) {

       $httpBackend.expectGET(expectedBaseUri + "proposal/user?filter=Stephan+Janssen&q=Stephan&q=Janssen").respond(expected);

        var actual = UserService.getSpeakerBySearchName("Stephan Janssen");

        $httpBackend.flush();

        expect(actual).toBeDefined();
        // expect(actual).toEqualData(expected);
    }));


    it('should allow a user to update his/her profile', inject(function ($httpBackend) {

// TODO
//        var user = { id: 123, "firstname": "stephan"};
//
//        $httpBackend.expectPUT(expectedBaseUri + "proposal/profile?filter=sja@devoxx.com&q=sja@devoxx.com").respond(expected);
//
//        var actual = UserService.updateProfile(user);
//
//        $httpBackend.flush();
//
//        expect(actual).toBeDefined();

    }));

    it('should allow to retrieve an event', inject(function ($httpBackend) {

        $httpBackend.expectGET(expectedBaseUri + "proposal/event?").respond(expected);

        var actual = EventService.load();

        $httpBackend.flush();

        expect(actual).toBeDefined();
    }));


});
