'use strict';

describe('Filters', function() {

    beforeEach(module('cfpSpeakerApp'));

    it('should combine all array elements in one space separated string', inject(function($filter) {
        var result = $filter('spaceSeparatedArray')(['1', '2', '3']);
        expect(result).toEqual('1 2 3');
    }));
});
