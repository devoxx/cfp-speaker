'use strict';

angular.module('cfpSpeakerApp').directive('devoxxOnReturnKey',function () {
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
}).directive('devoxxSetFocusOn',function ($timeout) {
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
  }).directive('carousel',function () {
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

          console.log('bxSlider');

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