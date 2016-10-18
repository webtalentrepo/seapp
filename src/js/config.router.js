'use strict';

/**
 * Config for the router
 */
angular.module('app')
	.run(
		[
			'$rootScope', '$state', '$stateParams', '$location', 'AUTH_EVENTS', 'commonService',
			function ($rootScope, $state, $stateParams, $location, AUTH_EVENTS, commonService) {
				commonService.setLoginFailed();
				$rootScope.$on('$routeChangeStart', function () {
					var userInfo = commonService.getUserInfo();
					var adminStatus = false;
					if (userInfo.login === AUTH_EVENTS.LOGIN_SUCCESS || userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS) {
						if (userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS) {
							adminStatus = true;
						}
						commonService.setLoginSuccess(adminStatus);
					} else {
						commonService.setLoginFailed();
					}
				});
			}
		]
	)
	.config(
		[
			'$stateProvider', '$urlRouterProvider', '$localStorageProvider', 'AUTH_EVENTS', 'JQ_CONFIG', 'MODULE_CONFIG',
			function ($stateProvider, $urlRouterProvider, $localStorageProvider, AUTH_EVENTS, JQ_CONFIG, MODULE_CONFIG) {
				var layout = "tpl/app/app.html";
				if ($localStorageProvider.get("IM_login") === AUTH_EVENTS.LOGIN_SUCCESS) {
					$urlRouterProvider.otherwise('/app/dashboard');
				} else {
					$urlRouterProvider.otherwise('/access/signin');
				}
				$stateProvider
					.state('app', {
						abstract: true,
						url: '/app',
						templateUrl: layout
					})
					.state('apps', {
						abstract: true,
						url: '/apps',
						templateUrl: 'tpl/layout.html'
					})
					// Survey For Emails
					.state('app.survey', {
						url: '/survey',
						template: '<div ui-view class="fade-in-down"></div>'
					})
					.state('app.survey.dashboard', {
						url: '/dashboard',
						templateUrl: 'tpl/app/survey/dashboard.html',
						controller: 'DashboardSurveyController',
						controllerAs: 'surveydash',
						resolve: load([
							'highchart',
							'js/app/survey/controllers/dashboard.js'
						], function () {
							window.localStorage.CURR_SRC = "app.survey.dashboard";
							return true;
						})
					})
					.state('app.survey.select', {
						url: '/select',
						templateUrl: 'tpl/app/survey/select.html',
						controller: 'SelectSurveyController',
						controllerAs: 'surveysel',
						resolve: load([
							'toaster',
							'js/app/survey/controllers/select.js'
						], function () {
							window.localStorage.CURR_SRC = "app.survey.select";
							return true;
						})
					})
					.state('app.survey.generate', {
						url: '/generate/:key_url',
						templateUrl: 'tpl/app/survey/generate.html',
						controller: 'SelectGenerateController',
						controllerAs: 'surveygen',
						resolve: load([
							'toaster',
							'xeditable',
							'js/app/survey/controllers/generate.js'
						], function () {
							window.localStorage.CURR_SRC = "app.survey.generate";
							return true;
						})
					})
					// pages
					.state('app.page', {
						url: '/page',
						template: '<div ui-view class="fade-in-down"></div>'
					})
					.state('app.page.profile', {
						url: '/profile',
						templateUrl: 'tpl/access/profile.html',
						controller: 'ProfileController',
						controllerAs: 'profile',
						resolve: load(['toaster', 'xeditable', 'ngImgCrop', 'js/app/access/controllers/profile.js'], function () {
							window.localStorage.CURR_SRC = "app.page.profile";
							return true;
						})
					})
					.state('app.page.manage', {
						url: '/manage',
						templateUrl: 'tpl/access/manage.html',
						controller: 'UserManageController',
						controllerAs: 'manage',
						resolve: load(['toaster', 'xeditable', 'js/app/access/controllers/manage.js'], function () {
							window.localStorage.CURR_SRC = "app.page.manage";
							return true;
						})
					})
					// others
					.state('lockme', {
						cache: false,
						url: '/lockme',
						templateUrl: 'tpl/access/lockme.html',
						controller: 'LockMeController',
						controllerAs: 'lockme',
						resolve: load(['toaster', 'js/app/access/controllers/lockme.js'])
					})
					.state('access', {
						url: '/access',
						template: '<div ui-view class="fade-in-right-big smooth"></div>'
					})
					.state('access.signin', {
						url: '/signin',
						templateUrl: 'tpl/access/signin.html',
						controller: 'SigninFormController',
						controllerAs: 'signin',
						resolve: load(['js/app/access/controllers/signin.js'])
					})
					// .state('access.signup', {
					// 	url: '/signup',
					// 	templateUrl: 'tpl/access/signup.html',
					// 	controller: 'SignupFormController',
					// 	controllerAs: 'signup',
					// 	resolve: load(['js/app/access/controllers/signup.js'])
					// })
					.state('access.forgotpwd', {
						url: '/forgotpwd',
						templateUrl: 'tpl/access/forgotpwd.html',
						controller: 'ForgotPassController',
						controllerAs: 'forgot',
						resolve: load(['js/app/access/controllers/forgot.js'])
					})
					.state('access.reset', {
						url: '/reset/:retrieveKey',
						templateUrl: 'tpl/access/reset.html',
						controller: 'ResetPasswordController',
						controllerAs: 'reset',
						resolve: load(['js/app/access/controllers/reset.js'])
					})
					.state('access.404', {
						url: '/404',
						templateUrl: 'tpl/page_404.html'
					});

				function load(srcs, callback) {
					return {
						deps: ['$ocLazyLoad', '$q',
							function ($ocLazyLoad, $q) {
								var deferred = $q.defer();
								var promise = false;
								srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
								if (!promise) {
									promise = deferred.promise;
								}
								angular.forEach(srcs, function (src) {
									promise = promise.then(function () {
										if (JQ_CONFIG[src]) {
											return $ocLazyLoad.load(JQ_CONFIG[src]);
										}
										var name = '';
										angular.forEach(MODULE_CONFIG, function (module) {
											if (module.name == src) {
												name = module.name;
											} else {
												name = src;
											}
										});
										return $ocLazyLoad.load(name);
									});
								});
								deferred.resolve();
								return callback ? promise.then(function () {
									return callback();
								}) : promise;
							}]
					};
				}

			}
		]
	);
