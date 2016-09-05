'use strict';

/* Controllers */

angular.module('app')
	.controller('AppCtrl', [
		'$scope', '$localStorage', '$window', 'authModelService', 'commonService', 'THEME_SETTINGS',
		function ($scope, $localStorage, $window, authModelService, commonService, THEME_SETTINGS) {
			// add 'ie' classes to html
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			if (isIE) {
				angular.element($window.document.body).addClass('ie');
			}
			if (isSmartDevice($window)) {
				angular.element($window.document.body).addClass('smart')
			}
			
			// config
			$scope.app = {
				name: 'EmailSurvey',
				full_name: 'Email Surveys',
				version: '1.0.0',
				// for chart colors
				color: {
					primary: '#7266ba',
					info: '#23b7e5',
					success: '#27c24c',
					warning: '#fad733',
					danger: '#f05050',
					light: '#e8eff0',
					dark: '#3a3f51',
					black: '#1c2b36'
				},
				settings: THEME_SETTINGS
			};
			
			$scope.userInfo = commonService.getUserInfo();
			
			// save settings to local storage
			if (angular.isDefined($localStorage.settings)) {
				$scope.app.settings = $localStorage.settings;
			} else {
				$localStorage.settings = $scope.app.settings;
			}
			
			function isSmartDevice($window) {
				// Adapted from http://www.detectmobilebrowsers.com
				var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
				// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
				return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
			}
			
		}]);
