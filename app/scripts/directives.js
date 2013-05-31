'use strict';

angular.module('cfpSpeakerApp')
    .directive('devoxxUniform', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setDisplayText = function () {
                    var text = $(element).children('option:selected').text();
                    $(element).parent().children('span').each(function () {
                        $(this)[0].innerHTML = text;
                    });
                };

                var watchNgInvalid = function () {
                    return $(element).hasClass('ng-invalid');
                };
                var applyInvalidCss = function (element, invalid) {
                    var elem = element;
                    if (!elem.attr('data-original-color')) {
                        elem.attr('data-original-color', elem.css('color'));
                    }
                    if (!elem.attr('data-original-background-color')) {
                        elem.attr('data-original-background-color', elem.css('background-color'));
                    }
                    if (!elem.attr('data-original-border-color')) {
                        elem.attr('data-original-border-color', elem.css('border-color'));
                    }

                    if (invalid) {
                        elem.addClass('ng-invalid');
                    } else {
                        elem.removeClass('ng-invalid')
                    }
                };

                function watchWithNoParentElement() {
                    scope.$watch(watchNgInvalid, function (newValue, oldValue) {
                        applyInvalidCss($(element), newValue);
                    });
                }

                function watchWithParentElement(parentSelector) {
                    scope.$watch(watchNgInvalid, function (newValue, oldValue) {
                        var elem = $(element).parents(parentSelector);
                        applyInvalidCss($(elem), newValue);
                    });

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            setDisplayText();
                        }
                    });

                    var showHideParent = function (newValue) {
                        $(element).parent().css('display', newValue ? '' : 'none')
                    };

                    if (attrs.ngShow) {
                        scope.$watch(attrs.ngShow, function (newValue, oldValue) {
                            showHideParent(newValue);
                        });
                    }
                    if (attrs.ngHide) {
                        scope.$watch(attrs.ngHide, function (newValue, oldValue) {
                            showHideParent(!newValue);
                        });
                    }
                }

                var width = null;
                var tagName = element[0].tagName.toLowerCase();
                if (tagName === 'input') {
                    var type = element[0].type;
                    tagName = tagName + type;
                }

                switch (tagName) {
                    case 'inputtext':
                    case 'inputpassword':
                    case 'inputemail':
                    case 'input':
                    case 'textarea':
                        width = '319px';
                        watchWithNoParentElement();
                        break;
                    case 'inputcheckbox':
                        watchWithParentElement('.checker');
                        break;
                    case 'select':
                        width = '292px';
                        watchWithParentElement('.selector');
                        break;
                }

                if (width) {
                    $(element).css({
                        'width': width
                    });
                }
                $(element).uniform();
                setTimeout(function () {
                    setDisplayText();
                }, 0)
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
    }).directive('tweetwall', function ($timeout) {
        return {
            restrict: 'A',
            replace: true,
            link: function ($scope, element, attrs) {

                if ($scope.$last && element.ready) {

                    $timeout(function(){ // Schedule after Angular rendering

                        var slider = $(element).parent().bxSlider({
                            mode: 'vertical',   /* */
                            speed: 500,         /* */
                            auto: true,         /* */
                            minSlides: 3,       /* */
                            maxSlides: 3,       /* */
                            slideMargin: 0,     /* */
                            pause: 2000,        /* timeout between animation */
                            moveSlides: 1,      /* number slides to move */
                            controls: false,    /* show prev/next */
                            pager: false,       /* show pager */
                            touchEnabled: false,
                            swipeThreshold: 50,
                            oneToOneTouch: false,
                            easing: 'ease',
                            tickerHover: true,
                            adaptiveHeight: true
                        });


                    },0);    

                }
                    
            }
        };
    });