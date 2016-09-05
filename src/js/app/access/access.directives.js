'use strict';

app_access
    .directive('checkEmailAsync', [
        'userServiceAsync',
        function (userServiceAsync) {
            return {
                require: "ngModel",
                link: function (scope, elem, attrs, ctrl) {
                    elem.bind('blur', function () {
                        ctrl.__CHECKING_EMAIL = true;
                        userServiceAsync.isDuplicateEmailAsync(ctrl.$viewValue).then(function (hasEmail) {
                            ctrl.$setValidity('isDuplicatedEmail', !hasEmail);
                        })['finally'](function () {
                            ctrl.__CHECKING_EMAIL = false;
                        });
                    });
                }
            };
        }
    ])
    .directive('compareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    })
    /**
     * Tooltip
     * @returns {{restrict: string, link: link}}
     * @constructor
     */
    .directive('tooltipToggle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (attrs.toggle === "tooltip") {
                    $(element).tooltip();
                }
                if (attrs.toggle === "popover") {
                    $(element).popover();
                }
            }
        };
    });
