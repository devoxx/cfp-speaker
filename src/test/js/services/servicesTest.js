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
      ConfigAPI,
    expected = {results: [
      {
        "expectedData": 123
      }
    ]
    };

  beforeEach(inject(function (_TalksService_, _UserService_, _ConfigAPI_) {
      TalksService = _TalksService_;
      UserService = _UserService_;
      ConfigAPI = _ConfigAPI_;

  }));

  it('should get all presentations for speaker', inject(function ($httpBackend) {

    $httpBackend.expectGET(new RegExp(ConfigAPI.endPoint + "/event/200/presentation?")).respond(expected);

    var event = { id: 200 };

    var actual = TalksService.allTalksForSpeaker(event);

    $httpBackend.flush();

    // TODO expect(actual).toBeDefined();
    // TODO  expect(actual).toEqualData(expected);
  }));


  it('should get all presentations by id', inject(function ($httpBackend) {

    $httpBackend.expectGET("http://localhost:8080/v2/proposal/event/123/presentation/456?").respond(expected);

    var event = { id: 123 };
    var talk = { id: 456 };

    var actual = TalksService.byId(event, talk);

    $httpBackend.flush();

    // TODO expect(actual).toBeDefined();
    // TODO expect(actual).toEqualData(expected);
  }));


});
