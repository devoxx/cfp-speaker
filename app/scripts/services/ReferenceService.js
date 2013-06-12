'use strict';

genericServices.factory('ReferenceService', ['$http', '$q', function($htp, $q) {
    function transformIdToLabel(id) {
        var words = id.split("_"),
            ret = '', word, i;

        for (i = 0; i < words.length; i++) {
            word = words[i];
            if (word == 'AND') {
                ret += 'and';
            } else {
                ret += capitalize(word);
            }

            ret += ' ';
        }

        return ret.trim();
    }

    function capitalize(word) {
        if (word.length > 1) {
            return word.substring(0, 1).toUpperCase() +
                word.substring(1).toLowerCase();
        } else {
            return word;
        }
    }

    var self = {
        countriesCache: null,
        getCountries: function() {
            if (!self.countriesCache) {
                var newCache = [];
                for (var i = 0; i < devoxxCountriesEnum.length; i++) {
                    var country = devoxxCountriesEnum[i];
                    country.label = transformIdToLabel(country.id);
                    newCache.push(country);
                }
                self.countriesCache = newCache;
            }
            return self.countriesCache;
        }
    };
    return self;
}]);