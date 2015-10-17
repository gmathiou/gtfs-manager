/* 
 *   Angular Timepicker 1.0.5
 *   https://github.com/Geta/angular-timepicker
 *
 *   Copyright 2013, Geta AS
 *   Author: Dzulqarnain Nasir
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

angular.module('dnTimepicker', ['ui.bootstrap.position', 'dateParser'])
    .factory('dnTimepickerHelpers', function() {
        'use strict';

        return {
            stringToMinutes: function(str) {
                if(!str) return null;

                var t = str.match(/(\d+)(h?)/);
                return t[1] ? t[1] * (t[2] ? 60 : 1) : null;
            },

            buildOptionList: function(minTime, maxTime, step) {
                var result = [];

                var i = angular.copy(minTime);
                while (i <= maxTime) {
                    result.push(new Date(i));
                    i.setMinutes(i.getMinutes() + step);
                }

                return result;
            },

            getClosestIndex: function(value, from) {
                if(!value) return -1;
            
                var closest = null;
                var index = -1;

                var _value = value.getHours() * 60 + value.getMinutes();
                for (var i = 0; i < from.length; i++) {
                    var current = from[i];
                    var _current = current.getHours() * 60 + current.getMinutes();

                    if (closest === null || Math.abs(_current - _value) < Math.abs(closest - _value)) {
                        closest = _current;
                        index = i;
                    }
                }
                return index;
            }
        }
    })
    .directive('dnTimepicker', ['$compile', '$parse', '$position', '$document', 'dateFilter', '$dateParser', 'dnTimepickerHelpers', '$log', function($compile, $parse, $position, $document, dateFilter, $dateParser, dnTimepickerHelpers, $log) {
        'use strict';

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(originalScope, element, attrs, ngModel) {
                var scope = originalScope.$new();

                // Local variables
                var current = null,
                    list = [],
                    updateList = true;

                // Model
                scope.timepicker = {
                    element: null,
                    timeFormat: 'h:mm a',
                    minTime: $dateParser('0:00', 'H:mm'),
                    maxTime: $dateParser('23:59', 'H:mm'),
                    step: 15,
                    isOpen: false,
                    activeIdx: -1,
                    optionList: function() {
                        if(updateList) {
                            list = dnTimepickerHelpers.buildOptionList(scope.timepicker.minTime, scope.timepicker.maxTime, scope.timepicker.step);
                            updateList = false;
                        }
                        return list;
                    }
                };

                // Init attribute observers

                attrs.$observe('dnTimepicker', function(value) {
                    if(value) {
                        scope.timepicker.timeFormat = value;
                    }

                    ngModel.$render();
                });

                // Deprecated - but we should still support it for a while
                attrs.$observe('timeFormat', function(value) {
                    if(value) {
                        $log.warn('The time-format attribute is deprecated and will be removed in the next version. Specify time format as value for dn-timepicker attribute.')
                        scope.timepicker.timeFormat = value;
                    }

                    ngModel.$render();
                });

                attrs.$observe('minTime', function(value) {
                    if(!value) return;

                    scope.timepicker.minTime = $dateParser(value, scope.timepicker.timeFormat);
                    updateList = true;
                });

                attrs.$observe('maxTime', function(value) {
                    if(!value) return;

                    scope.timepicker.maxTime = $dateParser(value, scope.timepicker.timeFormat);
                    updateList = true;
                });

                attrs.$observe('step', function(value) {
                    if(!value) return;

                    var step = dnTimepickerHelpers.stringToMinutes(value);
                    if(step) scope.timepicker.step = step;
                    
                    updateList = true;
                });

                // Set up renderer and parser

                ngModel.$render = function() {
                    var timeString = angular.isDate(ngModel.$viewValue) ? dateFilter(ngModel.$viewValue, scope.timepicker.timeFormat) : '';
                    element.val(timeString);

                    if(!isNaN(ngModel.$modelValue)) current = ngModel.$modelValue;
                };

                // Parses manually entered time
                var parseDate = function(viewValue) {
                    var date = angular.isDate(viewValue) ? viewValue : $dateParser(viewValue, scope.timepicker.timeFormat);

                    if(isNaN(date)) {
                        ngModel.$setValidity('time', false);
                    } else {
                        ngModel.$setValidity('time', true);

                        if(current) {
                            current.setHours(date.getHours());
                            current.setMinutes(date.getMinutes());
                            current.setSeconds(date.getSeconds());

                            return current;
                        }
                    }

                    return date;
                };
                ngModel.$parsers.unshift(parseDate);

                // Set up methods

                // Select action handler
                scope.select = function(time) {
                    if(!angular.isDate(time)) {
                        return;
                    }

                    current.setHours(time.getHours());
                    current.setMinutes(time.getMinutes());
                    current.setSeconds(time.getSeconds());

                    ngModel.$setViewValue(current);
                    ngModel.$render();
                };

                // Checks for current active item
                scope.isActive = function(index) {
                    return index === scope.timepicker.activeIdx;
                };

                // Sets the current active item
                scope.setActive = function(index) {
                    scope.timepicker.activeIdx = index;
                };

                // Opens the timepicker
                scope.openPopup = function() {
                    // Set position
                    scope.position = $position.position(element);
                    scope.position.top = scope.position.top + element.prop('offsetHeight');

                    // Open list
                    scope.timepicker.isOpen = true;

                    // Set active item
                    scope.timepicker.activeIdx = dnTimepickerHelpers.getClosestIndex(ngModel.$modelValue, scope.timepicker.optionList());

                    // Trigger digest
                    scope.$digest();

                    // Scroll to selected
                    if (scope.timepicker.element && scope.timepicker.activeIdx > -1) {
                        var target = scope.timepicker.element[0].querySelector('.active');
                        target.parentNode.scrollTop = target.offsetTop;
                    }
                };

                // Append timepicker dropdown
                element.after($compile(angular.element('<div dn-timepicker-popup></div>'))(scope));

                // Set up the element
                element
                    .bind('focus', function() {
                        scope.openPopup();
                    });

                $document.bind('click', function(event) {
                    if (scope.timepicker.isOpen && event.target !== element[0]) {
                        scope.timepicker.isOpen = false;
                        scope.$apply();
                    }
                });

                // Set initial value
                if(!angular.isDate(ngModel.$modelValue)) {
                    ngModel.$setViewValue(new Date());
                }

                // Set initial selected item
                current = ngModel.$modelValue;
            }
        };
    }])
    .directive('dnTimepickerPopup', [function() {
        'use strict';

        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            template: '<ul class="dn-timepicker-popup dropdown-menu" ng-style="{display: timepicker.isOpen && \'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\
            <li ng-repeat="time in timepicker.optionList()" ng-class="{active: isActive($index) }" ng-mouseenter="setActive($index)">\
            <a ng-click="select(time)">{{time | date:timepicker.timeFormat}}</a>\
            </li>\
            </ul>',
            link: function(scope, element, attrs) {
                scope.timepicker.element = element;

                element.find('a').bind('click', function(event) {
                    event.preventDefault();
                });
            }
        };
    }]);