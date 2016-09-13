'use strict';

app_survey.controller('DashboardSurveyController', [
	'$rootScope', '$state', '$scope', '$window', '$localStorage', 'surveyModelService', 'AUTH_EVENTS', 'commonService', 'APP_SETTINGS',
	function ($rootScope, $state, $scope, $window, $localStorage, surveyModelService, AUTH_EVENTS, commonService, APP_SETTINGS) {
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
		
		that.embedLink = '';
		that.embedCode = '';
		$scope.GetEmbedTemp = function (temp) {
			that.embedLink = '<a href="' + APP_SETTINGS.SURVEY_URL + temp.key_url + '">' + temp.temp_name + '</a>';
			console.log(temp);
			var tempCode = '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">';
			tempCode += '<tr>';
			tempCode += '<td align="center" width="100%">';
			tempCode += '<table align="center" style="color: #111; font-family: Helvetica, Arial, sans-serif;border-radius: 4px;border: 1px solid #ddd;max-width:600px;margin: 30px auto; padding: 20px;">';
			tempCode += '<tr>';
			tempCode += '<td align="center" style="font-weight: bold;font-size: 32px;padding-top: 25px;min-width: 400px;">' + temp.temp_header + '</td>';
			tempCode += '</tr>';
			if (temp.temp_image != '') {
				tempCode += '<tr>';
				tempCode += '<td>';
				tempCode += '<a href="' + temp.temp_image + '">';
				tempCode += '<img src="' + temp.temp_image + '" alt="Click here show the image." style="cursor: pointer;vertical-align: middle;display: inline-block;max-width: 98%;height: auto;padding: 4px;line-height: 1.42857143;background-color: #fff;border: 1px solid #ddd;border-radius: 4px;-webkit-transition: all .2s ease-in-out;-moz-transition: all .2s ease-in-out;-ms-transition: all .2s ease-in-out;-o-transition: all .2s ease-in-out;transition: all .2s ease-in-out;">';
				tempCode += '</a>';
				tempCode += '</td>';
				tempCode += '</tr>';
			}
			if (temp.section_id == 1 || temp.section_id == 2) {
				tempCode += '<tr>';
				tempCode += '<td align="center" style="padding-top: 25px;font-size: 22px;">' + temp.temp_header1 + '</td>';
				tempCode += '</tr>';
			}
			if (temp.section_id == 1) {
				for (var i in temp.temp_data) {
					var p = i == 0 ? 25 : 5;
					var href_flag = temp.key_url + '_COL_' + temp.temp_data[i].name + '_COL_' + i + '_COL_' + temp.temp_data[i].link;
					var href_url = APP_SETTINGS.TARGET_URL + btoa(href_flag);
					tempCode += '<tr>';
					tempCode += '<td align="center" style="padding-top: ' + p + 'px;">';
					tempCode += '<a href="' + href_url + '" style="min-width: 200px;display: inline-block;margin-top: 5px;color: #fff !important;background-color: #23b7e5;border-color: #23b7e5;padding: 10px 16px;font-size: 18px;line-height: 1.3333333;border-radius: 6px;cursor: pointer;text-align: center;text-decoration: none;">';
					tempCode += temp.temp_data[i].name + '</a>';
					tempCode += '</td>';
					tempCode += '</tr>';
				}
			} else if (temp.section_id == 2) {
				tempCode += '<tr><td><br/><br/></td></tr>';
				
			} else if (temp.section_id == 3) {
				tempCode += '<tr><td><br/><br/></td></tr>';
				tempCode += '<tr><td>';
				tempCode += '<table align="center" width="100%" border="0">';
				tempCode += '<tr>';
				tempCode += '<td align="right" style="padding-right: 20px;">';
				var href_flag3 = temp.key_url + '_COL_' + temp.temp_data[0].name + '_COL_' + 0 + '_COL_' + temp.temp_data[0].link;
				var href_url3 = APP_SETTINGS.TARGET_URL + btoa(href_flag3);
				tempCode += '<a href="' + href_url3 + '" style="min-width: 100px;border-radius: 50px;color: #fff !important;background-color: #27c24c;border-color: #27c24c;font-weight: 500;outline: 0 !important;padding: 15px 25px;font-size: 18px;line-height: 1.3333333;text-align: center;cursor: pointer;text-decoration: none;display: inline-block;">';
				tempCode += temp.temp_data[0].name + '</a>';
				tempCode += '</td>';
				tempCode += '<td align="left" style="padding-left: 20px;">';
				href_flag3 = temp.key_url + '_COL_' + temp.temp_data[1].name + '_COL_' + 1 + '_COL_' + temp.temp_data[1].link;
				href_url3 = APP_SETTINGS.TARGET_URL + btoa(href_flag3);
				tempCode += '<a href="' + href_url3 + '" style="min-width: 100px;border-radius: 50px;color: #fff !important;background-color: #f05050;border-color: #f05050;font-weight: 500;outline: 0 !important;padding: 15px 25px;font-size: 18px;line-height: 1.3333333;text-align: center;cursor: pointer;text-decoration: none;display: inline-block;">';
				tempCode += temp.temp_data[1].name + '</a>';
				tempCode += '</td>';
				tempCode += '</tr>';
				tempCode += '</table>';
				tempCode += '</td></tr>';
			}
			tempCode += '<tr><td><br/></td></tr>';
			tempCode += '</table>';
			tempCode += '</td>';
			tempCode += '</tr>';
			tempCode += '</table>';
			that.embedCode = tempCode;
			$.fancybox({
				href: "#embedTemp",
				width: 800,
				autoSize: false,
				scrolling: "auto"
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
		$scope.clickText = function (id) {
			$("#" + id).focus().select();
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
		};
		
		$scope.reportData = [];
		$scope.totalClicks = 0;
		$scope.ReportTemp = function (temp) {
			$scope.reportData = [];
			var param = {
				id: temp.id
			};
			surveyModelService.GetReportData(param).then(function (response) {
				var re = angular.fromJson(response);
				if (re.result === 'success') {
					$scope.reportData = re.data;
					$scope.totalClicks = re.totalClicks * 1;
					$.fancybox({
						href: "#clickReport",
						width: 600,
						autoSize: false,
						scrolling: "auto"
					});
				}
			});
		};
	}]
);
