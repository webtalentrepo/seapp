'use strict';
var app =
	angular.module('app')
		.config(
			['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
				function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
					// lazy controller, directive and service
					app.controller = $controllerProvider.register;
					app.directive = $compileProvider.directive;
					app.filter = $filterProvider.register;
					app.factory = $provide.factory;
					app.service = $provide.service;
					app.constant = $provide.constant;
					app.value = $provide.value;
				}
			])
		.config(['$httpProvider', function ($httpProvider) {
			// $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
			$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
			// delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}]);