'use strict';

app_survey.controller('SelectSurveyController', [
	'$rootScope', '$state', '$window', '$localStorage', 'surveyModelService', 'AUTH_EVENTS', 'commonService', 'toaster',
	function ($rootScope, $state, $window, $localStorage, surveyModelService, AUTH_EVENTS, commonService, toaster) {
		var userInfo = $rootScope.$$childHead.userInfo = commonService.getUserInfo();
		if (userInfo.login !== AUTH_EVENTS.LOGIN_SUCCESS) {
			commonService.setLoginFailed();
			$state.go('access.signin', {}, {reload: true});
		} else {
			commonService.setLoginSuccess((userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS));
		}
		var that = this;
		that.SelectTemp = SelectTemp;
		that.cancelSave = cancelSave;
		that.saveTempName = saveTempName;
		
		that.TempName = '';
		that.SE_tempId = "";
		function SelectTemp(flag) {
			that.SE_tempId = flag;
			$localStorage.SE_tempType = "NEW";
			$.fancybox({
				href: "#saveTemp",
				modal: true,
				width: 300,
				height: 150,
				autoSize: false,
				scrolling: "no"
			});
		}
		
		function cancelSave() {
			if ($.fancybox) {
				$.fancybox.close();
			}
			that.TempName = "";
			that.SE_tempId = "";
			$localStorage.SE_tempName = "";
			$localStorage.SE_tempType = "";
			return false;
		}
		
		function saveTempName() {
			if (that.TempName === '' || that.TempName === null) {
				toaster.pop('error', 'Error!', 'Please insert your survey subject.');
				return;
			}
			$localStorage.SE_tempName = that.TempName;
			if ($.fancybox) {
				$.fancybox.close();
			}
			$state.go('app.survey.generate', {key_url: that.SE_tempId});
		}
	}]
);
