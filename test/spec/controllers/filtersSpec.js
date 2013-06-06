'use strict';

describe('Filters', function() {

    beforeEach(module('cfpSpeakerApp'));

    var filter;
    beforeEach(inject(function($filter) {
        filter = $filter;
    }));

    xdescribe('spaceSeparatedArray', function() {
        it('should combine all array elements in one space separated string', inject(function() {
            var result = filter('spaceSeparatedArray')(['1', '2', '3']);
            expect(result).toEqual('1 2 3');
        }));

        it('should return an empty string if an empty array is passed in', inject(function() {
            var result = filter('spaceSeparatedArray')([]);
            expect(result).toEqual('');
        }));

        it('should return an empty string if null is passed in', inject(function() {
            var result = filter('spaceSeparatedArray')();
            expect(result).toEqual('');
        }));
    });

    xdescribe('exclude', function() {
        it('should return an empty array if the both arguments are empty', function() {
            var result = filter('exclude')([], []);
            expect(result).toEqual([]);
        });

        it('should return an empty array if the first argument is empty', function() {
            var result = filter('exclude')([], [1,2,3]);
            expect(result).toEqual([]);
        });

        it('should return an array equal to the first argument if the second argument is empty', function() {
            var result = filter('exclude')([1,2,3], []);
            expect(result).toEqual([1,2,3]);
        });

        it('should return an array equal to the first argument with the elements from the second array left out', function() {
            var result = filter('exclude')([1,2,3,4,5], [2,4]);
            expect(result).toEqual([1,3,5]);
        });

        it('should not accept the first argument to be null', function() {
            function test() {
                filter('exclude')(null, [1,2]);
            }
            expect(test).toThrow();
        });

        it('should return an array equal to the first argument if the second argument is null', function() {
            var result = filter('exclude')([1,2,3], null);
            expect(result).toEqual([1,2,3]);
        });
    });
});
