'use strict';

angular.module('cfpSpeakerApp')
  .directive('devoxxUniform', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var width = null;
        var tagName = element[0].tagName.toLowerCase();
        switch (tagName) {
          case 'input':
          case 'textarea':
            width = '319px';
            break;
          case 'select':
            width = '300px';
            break;
        }

        if (width) {
          $(element).css({
            'width': width
          });
        }
        $(element).uniform();
      }
    };
  })
  .directive('devoxxOnReturnKey',function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $(element).keypress(function (e) {
          if (e.which === 13) {
            scope.$apply(attrs.devoxxOnReturnKey);
            return false;
          }
        });
      }
    };
  }).directive('devoxxSetFocusOn', function ($timeout) {
    return {
      link: function (scope, element, attrs, ctrl) {
        scope.$watch(attrs.devoxxSetFocusOn, function (newValue, oldValue) {
          if (newValue && !oldValue) {
            var elemId = '#' + attrs.devoxxSetFocusField;
            var setFocusIfElementAvailable = function (elemId, delay) {
              $timeout(function () {
                var elem = $(elemId);
                if (elem.length) {
                  elem.focus();
                } else {
                  setFocusIfElementAvailable(elemId, 50);
                }
              }, delay);
            };

            setFocusIfElementAvailable(elemId);
          }
        });
      }
    };
  })
  .directive('devoxxValidateTwitterHandle', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          if (viewValue.indexOf('@') == 0) {
            viewValue = viewValue.substr(1);
          }
          var valid = /^[A-Za-z0-9_]{1,15}$/.test(viewValue);
          if (!valid) {
            viewValue = undefined;
          }
          ctrl.$setValidity('devoxxValidateTwitterHandle', valid);
          return viewValue;
        });
      }
    }
  })
  .directive('devoxxValidateExpression', function ($parse) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        var exprFn = $parse(attrs.devoxxValidateExpression);
        ctrl.$parsers.unshift(function (viewValue) {
          var valid = exprFn(scope);
          if (!valid) {
            ctrl.$setValidity('devoxxValidateExpression', valid);
          }
          return viewValue;
        });
      }
    }
  })
  .directive('carousel',function () {
    return {
      link: function (scope, element, attrs) {
        $(element).bxSlider({
          mode: 'fade', /* */
          speed: 500, /* */
          auto: true, /* */
          minSlides: 1, /* */
          maxSlides: 1, /* */
          slideMargin: 0, /* */
          pause: 4000, /* timeout between animation */
          moveSlides: 1, /* number slides to move */
          controls: false, /* show prev/next */
          pager: true, /* show pager */
          touchEnabled: true,
          swipeThreshold: 5,
          oneToOneTouch: true,
          tickerHover: true,
          adaptiveHeight: true
        });
      }
    };
  }).directive('news',function () {
    return {
      link: function (scope, element, attrs) {
        $(element).bxSlider({
          mode: 'horizontal', /* */
          speed: 500, /* */
          auto: false, /* */
          minSlides: 1, /* */
          maxSlides: 40, /* */
          slideMargin: 2, /* */
          pause: 4000, /* timeout between animation */
          moveSlides: 1, /* number slides to move */
          controls: true, /* show prev/next */
          pager: false, /* show pager */
          touchEnabled: true,
          swipeThreshold: 5,
          oneToOneTouch: true,
          slideWidth: 266,
          tickerHover: true,
          adaptiveHeight: true
        });
      }
    };
  }).directive('tweetwall', function () {
    return {
      link: function (scope, element, attrs) {
        scope.$watch('scope.tweets', function () {
          $(element).bxSlider({
            mode: 'vertical', /* */
            speed: 500, /* */
            auto: true, /* */
            minSlides: 1, /* */
            maxSlides: 3, /* */
            slideMargin: 0, /* */
            pause: 4000, /* timeout between animation */
            moveSlides: 1, /* number slides to move */
            controls: false, /* show prev/next */
            pager: false, /* show pager */
            touchEnabled: true,
            swipeThreshold: 50,
            oneToOneTouch: true,
            easing: 'ease',
            tickerHover: true,
            adaptiveHeight: true
          });

        });

      }
    };
  });