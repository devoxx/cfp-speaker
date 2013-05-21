'use strict';

describe('Service: GenericServices', function () {

  beforeEach(module('cfpSpeakerApp'));

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
      ConfigAPI,
    expected = {results: [
      {
        "expectedData": 123
      }
    ]
    };

  beforeEach(inject(function (_TalksService_, _UserService_, _EventService_, _ConfigAPI_) {
      EventService = _EventService_;
      TalksService = _TalksService_;
      UserService = _UserService_;
      ConfigAPI = _ConfigAPI_;
  }));

  xit('should get all presentations for speaker', inject(function ($httpBackend) {

    $httpBackend.expectGET(new RegExp(ConfigAPI.endPoint + "/proposal/event/200/presentation?")).respond(expected);

    var event = { id: 200 };

    var actual = TalksService.allTalksForSpeaker(event);

    $httpBackend.flush();

    expect(actual).toBeDefined();
// TODO    expect(actual).toEqualData(expected);

  }));

  xit('should get all presentations by id', inject(function ($httpBackend) {

    $httpBackend.expectGET(ConfigAPI.endPoint + "/proposal/event/123/presentation/456?userToken=xyz").respond(expected);

    var event = { id: 123 };
    var talk = { id: 456 };
    var userToken = "xyz";

    var actual = TalksService.byId(event, talk, userToken);

    $httpBackend.flush();

    expect(actual).toBeDefined();
// TODO   expect(actual).toEqualData(expected);

   }));

  xit('should allow a user to login', inject(function ($httpBackend) {

      var expected = { loginTokens: [ { token : "xyz"} ]};

      $httpBackend.expectPOST(ConfigAPI.endPoint + "/auth/login?login=stephan&password=test").respond(expected);

      var actual = UserService.login("stephan", "test");

      $httpBackend.flush();

      expect(actual).toBeDefined();
// TODO     expect(actual).toEqualData(expected);

   }));

   xit('should allow to get a speaker by email', inject(function ($httpBackend) {

       $httpBackend.expectGET(ConfigAPI.endPoint + "/proposal/user?filter=sja@devoxx.com&q=sja@devoxx.com").respond(expected);

        var actual = UserService.getSpeakerByEmailAddress("sja@devoxx.com");

        $httpBackend.flush();

        expect(actual).toBeDefined();
        // expect(actual).toEqualData(expected);
    }));


    xit('should allow a user to update his/her profile', inject(function ($httpBackend) {

// TODO
//        var user = { id: 123, "firstname": "stephan"};
//
//        $httpBackend.expectPUT(ConfigAPI.endPoint + "/proposal/profile?filter=sja@devoxx.com&q=sja@devoxx.com").respond(expected);
//
//        var actual = UserService.updateProfile(user);
//
//        $httpBackend.flush();
//
//        expect(actual).toBeDefined();

    }));

    xit('should allow to retrieve an event', inject(function ($httpBackend) {

        $httpBackend.expectGET(ConfigAPI.endPoint + "/proposal/event?").respond(expected);

        var actual = EventService.load();

        $httpBackend.flush();

        expect(actual).toBeDefined();
    }));

});
