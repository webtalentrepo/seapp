'use strict';

app_survey
	.directive('templatePreview', function () {
		return {
			restrict: "E",
			templateUrl: "tpl/app/survey/preview_template.html",
			scope: {
				data: "="
			},
			link: function ($scope, $element, $attrs) {
			}
		}
	})
	.directive('surveyPreview', function () {
		return {
			restrict: "E",
			templateUrl: "tpl/app/survey/preview_survey.html",
			scope: {
				data: "="
			},
			link: function ($scope, $element, $attrs) {
			}
		}
	});