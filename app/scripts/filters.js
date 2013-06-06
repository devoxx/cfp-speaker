'use strict';

angular.module('cfpSpeakerApp').filter('spaceSeparatedArray',function () {
    return function (input) {
        if (input && input.join) {
            return input.join(' ');
        } else {
            return '';
        }
    };
}).filter('exclude', function () {
    return function (input, otherArray) {
        var ret = [];
        if (!input) {
            throw new Error('input argument is required for "exclude" filter');
        }
        for (var i = 0; i < input.length; i++) {
            var obj = input[i];
            if (!otherArray || otherArray.indexOf(obj) == -1) {
                ret.push(obj);
            }
        }
        return ret;
    }
});