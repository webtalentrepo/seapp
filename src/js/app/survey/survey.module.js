'use strict';

var app_survey = angular.module('app.survey', [])
	.config(
		['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
			function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
				// lazy controller, directive and service
				app_survey.controller = $controllerProvider.register;
				app_survey.directive = $compileProvider.directive;
				app_survey.filter = $filterProvider.register;
				app_survey.factory = $provide.factory;
				app_survey.service = $provide.service;
				app_survey.constant = $provide.constant;
				app_survey.value = $provide.value;
			}
		]
	)
	/**
	 * HTML Bind Unsafe String Converter.
	 * @param $sce
	 * @returns {Function}
	 */
	.filter('unsafe', [
		'$sce', function ($sce) {
			return function (val) {
				return $sce.trustAsHtml(val);
			};
		}]
	);
