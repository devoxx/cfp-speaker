'use strict';

app.directive('devoxxOnReturnKey', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.keypress(function(e) {
                if (e.which == 13) {
                    scope.$apply(attrs.devoxxOnReturnKey);
                    return false;
                }
            });
        }
    };
});

app.directive('devoxxSetFocusOn', function ($timeout) {
    return {
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(attrs.devoxxSetFocusOn, function (newValue, oldValue) {
                if (newValue && !oldValue) {
                    $timeout(function () {
                        $('#' + attrs.devoxxSetFocusField).focus();
                    });
                }
            });
        }
    };
});

//
//app.directive('devoxxDoesNotExistInList', function($parse) {
//    return {
//        require: 'ngModel',
//        link: function(scope, element, attrs, ctrl) {
//            var listFn = $parse(attrs.devoxxDoesNotExistInList),
//                name = attrs.devoxxName;
//            ctrl.$parsers.unshift(function(viewValue) {
//                var list = listFn(scope), valid = true;
//                for (var i = 0; i < list.length; i++) {
//                    var listItem = list[i];
//                    if (name) {
//                        if (listItem[name] == viewValue) {
//                            valid = false;
//                            break;
//                        }
//                    } else {
//                        if (listItem == viewValue) {
//                            valid = false;
//                            break;
//                        }
//                    }
//                }
//                ctrl.$setValidity('devoxxDoesNotExistInList', valid);
//                return viewValue;
//            });
//        }
//    };
//});
//
//app.directive('devoxxErrorsForField', function($parse) {
//    return {
//        restrict: 'A',
//        compile: function(element, attrs) {
//            element.replaceWith(
//                '<span style="background-color: red; color: #ffffff" ng-show="addTagForm.newTag.$invalid">' +
//                'view {{addTagForm.newTag.$invalid}}' +
//                '</span>');
//        }
//    };
//});
//
//app.directive('devoxxDisableSubmitOn', function() {
//    return function(scope, element, attrs, ctrl) {
////        devoxxDisableSubmitOn="addTagForm.$invalid"
//        var disabled = false;
//        scope.$watch(attrs.devoxxDisableSubmitOn, function(newValue, oldValue) {
//            disabled = newValue;
//        });
//        $(element).bind('submit', function(e) {
//            if (disabled) {
//                e.preventDefault();
//                return false;
//            }
//        });
//    }
//})
