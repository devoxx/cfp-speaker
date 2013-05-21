'use strict';

angular.module('cfpSpeakerApp').filter('spaceSeparatedArray',function () {
  return function (input) {
    return input.join(' ');
  };
}).filter('exclude', function () {
    return function (input, otherArray) {
      var ret = [];
      for (var i = 0; i < input.length; i++) {
        var obj = input[i];
        console.log('' + otherArray + '.indexOf(' + obj + ') -->' + (otherArray.indexOf(obj) == -1))
        if (otherArray.indexOf(obj) == -1) {
          ret.push(obj);
        }
      }
      return ret;
    }
  });