'use strict';

angular.module('cfpSpeakerApp')
    .directive('scroll', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var MENU_BAR = 64 + 30; // always on top, menu height + margin

                $(element).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var anchorElem = $('a[name=' + attrs.scroll + ']');
                    if (anchorElem.length) {
                        var top = anchorElem.offset().top - MENU_BAR;
                        $('body').animate({scrollTop: top}, 800);
                    }
                }); 

            }
        }
    })
    .directive('devoxxMoreInfo', function(){
        return {
            restrict: 'A',
            template:   '<div class="row">'+
                            '<div class="col18 devoxxMoreInfo" ng-transclude>'+
                                '<label></label>'+
                            '</div>'+
                            '<div tooltip-placement="right" '+
                                'ng-class="{moreInfoDisabled:!info}" '+
                                'tooltip-html-unsafe="{{info}}" class="offset1 col1 moreInfo" >'+
                                '<span>?</span>'+
                            '</div>'+  
                        '</div>',
            replace:false,                        
            scope: {
                label: '@',
                info: '='
            },
            transclude: true,
            link: function(scope, element, attrs) {

                var inputCtrl = element.find('select');
                var label = element.find('label');
                label[0].innerHTML = scope.label
                label.prop('for', inputCtrl.attr('id'));
            }
        }
    })
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
                    case 'inputsubmit':
                    case 'input':
                    case 'textarea':
                        // width = '339px';
                        watchWithNoParentElement();
                        break;
                    case 'inputcheckbox':
                        watchWithParentElement('.checker');
                        break;
                    case 'select':
                        watchWithParentElement('.selector');
                        break;
                }

                if (width) {
                    $(element).css({
                        'width': width
                    });
                }

                $(element).uniform();

                scope.$watch(attrs.ngModel, function(){
                    $.uniform.update(); // Updates all uniform controls

                    // Fix widths on all dropdowns
                    $('.selector').css('width', '100%')
                    $('.selector span').css('width', '80%')
                    $('.selector select').css('width', '100%')
                    //Fix up the select with moreInfo tooltip so it aligns
                    $('.devoxxMoreInfo .selector span').css('width', '82%')
                });

                setTimeout(function () {
                    setDisplayText();
                }, 0)
            }
        };
    })
    .directive('devoxxOnReturnKey',function ($timeout) {
        return {
            priority: 200,
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).keydown(function (e) {
                    if (e.which === 13) {
                        $timeout(function() {
                            scope.$apply(attrs.devoxxOnReturnKey);
                        }, 0);
                        return false;
                    }
                });
            }
        };
    })
    .directive('devoxxSpecialKeys',function ($timeout) {
        return {
            priority: 300,
            restrict: 'A',
            link: function (scope, element, attrs) {
                var attrList = attrs.devoxxSpecialKeys.split(',');
                var list = [];
                $.each(attrList, function(idx, val) {
                    var trimmed = val.trim();
                    try {
                        var parsed = parseInt(trimmed);
                    } catch (e) {
                        throw new Error('Value "' + val + '" in directive: [devoxxSpecialKeys] is not a valid integer, current value: ' + list);
                    }
                    list[idx] = parsed;
                });
                $(element).keydown(function (e) {
                    if (jQuery.inArray(e.which, list) > -1) {
                        var newEvt = jQuery.Event("keydown");
                        newEvt.which = 13; // Return key code
                        $(element).trigger(newEvt);
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
    .directive('carousel',function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function(){
                    var lastStoredSlideIndex = 0,
                        item,
                        storeSlide;
                    if (Modernizr.localstorage) {
                        item = localStorage.getItem("devoxxLastStoredSlide");
                        if (item) {
                            lastStoredSlideIndex = parseInt(item);
                        }
                        storeSlide = function(index) {
                            localStorage.setItem("devoxxLastStoredSlide", index);
                        }
                    } else {
                        storeSlide = function(index) {
                            localStorage.setItem("devoxxLastStoredSlide", index);
                        }
                    }
                    $(element).find('ul').bxSlider({
                        mode: 'fade',       /* */
                        speed: 500,         /* */
                        auto: true,         /* */
                        minSlides: 1,       /* */
                        maxSlides: 1,       /* */
                        slideMargin: 0,     /* */
                        pause: 6000,        /* timeout between animation */
                        moveSlides: 1,      /* number slides to move */
                        controls: false,    /* show prev/next */
                        pager: true,        /* show pager */
                        touchEnabled: false,
                        swipeThreshold: 5,
                        oneToOneTouch: false,
                        tickerHover: true,
                        adaptiveHeight: true,
                        startSlide: lastStoredSlideIndex,
                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                            storeSlide(newIndex);
                        }
                    });

                },0);

            }
        };
    })
    .directive('accordeon',function ($timeout) {
        return {
            link: function (scope, element, attrs) {

                $timeout(function(){

                    $(element).find('.acco_title').click(function() {

                        $(element).find('.acco_content').slideUp('normal');    
                        $(this).next().slideDown('normal');
                    });

                },0);

            }
        };
    })
    .directive('isotope',function ($timeout) {
        return {
            link: function (scope, element, attrs) {

                $timeout(function(){

                    var $container = $(element).find("#contactList");

                    var $filters = $(element).find("#filters");

                    $container.isotope({
                        itemSelector : 'li',
                        layoutMode : 'fitRows'
                    });

                    $filters.find('a').click(function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        $filters.find('a').removeClass('selected');
                        $(this).addClass('selected');
                        var selector = $(this).attr('data-filter');
                        $container.isotope({ filter: selector });
                        return false;
                    });

                },0);

            }
        };
    })
    .directive('news',function () {
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
                            pause: 4000,        /* timeout between animation */
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