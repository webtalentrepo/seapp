'use strict';

app_survey.controller('DashboardSurveyController', [
	'$rootScope', '$state', '$scope', '$window', '$localStorage', 'surveyModelService', 'AUTH_EVENTS', 'commonService',
	function ($rootScope, $state, $scope, $window, $localStorage, surveyModelService, AUTH_EVENTS, commonService) {
		var userInfo = $rootScope.$$childHead.userInfo = commonService.getUserInfo();
		if (userInfo.login !== AUTH_EVENTS.LOGIN_SUCCESS) {
			commonService.setLoginFailed();
			$state.go('access.signin', {}, {reload: true});
		} else {
			commonService.setLoginSuccess((userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS));
		}
		var that = this;
		that.templateList = [];
		var params = {
			user_id: userInfo.user_id
		};
		
		$scope.isLoading = false;
		function getTempList() {
			$scope.isLoading = true;
			surveyModelService.GetSurveyData(params).then(function (response) {
				$scope.isLoading = false;
				var re = angular.fromJson(response);
				if (re.result === 'success') {
					that.templateList = re.data;
				}
			});
		}
		
		getTempList();
		
		$window.sessionStorage.Temp_currentPage = 1;
		$scope.pageChanged = function (newPage) {
			$window.sessionStorage.Temp_currentPage = newPage;
		};
		if ($window.sessionStorage.Temp_currentPage) {
			$scope.temp_pagination = {
				current: $window.sessionStorage.Temp_currentPage
			};
		} else {
			$scope.temp_pagination = {
				current: 1
			};
		}
		$scope.itemDisplayLength = 6;
		
		$scope.PreviewTemp = function (temp) {
			$scope.surveyData = temp;
			$.fancybox({
				href: "#previewSurvey",
				width: 600,
				autoSize: false,
				scrolling: "auto"
			});
		};
		$scope.EditTemp = function (temp) {
			$localStorage.SE_tempName = temp.temp_name;
			$localStorage.SE_tempType = temp.section_id;
			$state.go('app.survey.generate', {key_url: temp.id});
		};
		$scope.ReportTemp = function (temp) {
			
		};
		that.embedLink = '';
		$scope.GetEmbedTemp = function (temp) {
			var embedSrc = $window.location.origin + '/survey/' + temp.key_url;
			that.embedLink = '<a href=""><iframe src="' + embedSrc + '" style="border: 0; width: 100%; height: 100%;"></iframe></a>';
			$.fancybox({
				href: "#embedTemp",
				width: 400,
				height: 200,
				autoSize: false,
				scrolling: "no"
			});
		};
		$scope.DeleteTemp = function (temp) {
			if (!confirm("Are you sure want to delete this?")) {
				return;
			}
			var param = {
				id: temp.id,
				temp_file: temp.temp_file
			};
			surveyModelService.DeleteSurveyData(param).then(function (response) {
				var re = angular.fromJson(response);
				if (re.result === 'success') {
					getTempList();
				}
			});
		};
		$scope.clickText = function () {
			$("#embedLink").focus().select();
		};
		$scope.CloneTemp = function (temp) {
			var param = {
				id: temp.id,
				user_id: userInfo.user_id
			};
			$scope.isLoading = true;
			surveyModelService.CloneSurveyData(param).then(function (response) {
				$scope.isLoading = false;
				var re = angular.fromJson(response);
				if (re.result === 'success') {
					getTempList();
				}
			});
		}
	}]
);
