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
			var tempCode = '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">';
			tempCode += '<tr><td align="center" width="100%">';
			tempCode += '<table align="center" style="color: #111; font-family: Helvetica, Arial, sans-serif;border-radius: 4px;border: 1px solid #ddd;max-width:600px;margin: 30px auto; padding: 20px;">';
			tempCode += '<tr>';
			tempCode += '<td align="center" style="padding-top: 25px;min-width: 400px;"><h1 style="font-weight: bold;font-size: 32px;line-height: 1.3333333;">' + temp.temp_header + '</h1></td>';
			tempCode += '</tr>';
			if (temp.temp_image != '') {
				tempCode += '<tr><td align="center" style="text-align: center;"><a href="' + temp.temp_image + '" target="_blank" style="text-align: center;width: 100%;">';
				tempCode += '<img src="' + temp.temp_image + '" alt="Click here view the image." style="cursor: pointer;vertical-align: middle;display: inline-block;max-width: 98%;height: auto;padding: 4px;line-height: 1.42857143;background-color: #fff;border: 1px solid #ddd;border-radius: 4px;-webkit-transition: all .2s ease-in-out;-moz-transition: all .2s ease-in-out;-ms-transition: all .2s ease-in-out;-o-transition: all .2s ease-in-out;transition: all .2s ease-in-out;">';
				tempCode += '</a></td></tr>';
			}
			if (temp.section_id == 1 || temp.section_id == 2) {
				tempCode += '<tr><td align="center" style="padding-top: 25px;"><h4 style="font-weight: normal;font-size: 22px;line-height: 1.3333333;">' + temp.temp_header1 + '</h4></td></tr>';
			}
			if (temp.section_id == 1) {
				for (var i in temp.temp_data) {
					if (temp.temp_data[i].name == "" || temp.temp_data[i].name == null || temp.temp_data[i].name == undefined) {
						continue;
					}
					var p = i == 0 ? 25 : 5;
					var href_flag = temp.key_url + '_COL_' + encodeURIComponent(temp.temp_data[i].name) + '_COL_' + i + '_COL_' + temp.temp_data[i].link;
					var href_url = APP_SETTINGS.TARGET_URL + btoa(href_flag);
					tempCode += '<tr><td align="center" style="padding-top: ' + p + 'px;">';
					tempCode += '<a href="' + href_url + '" target="_blank" style="min-width: 200px;display: inline-block;margin-top: 5px;color: #fff !important;background-color: #23b7e5;border-color: #23b7e5;padding: 10px 16px;font-size: 18px;line-height: 1.3333333;border-radius: 6px;cursor: pointer;text-align: center;text-decoration: none;">';
					tempCode += temp.temp_data[i].name + '</a></td></tr>';
				}
			} else if (temp.section_id == 2) {
				tempCode += '<tr><td><br/><br/></td></tr><tr><td height="47px" style="height: 47px;" align="center">';
				for (var j in temp.temp_data.rateTemp) {
					var rateValue = ((j * 1) + 1);
					if (isNaN(rateValue)) {
						continue;
					}
					var iconType = '&#9734;';
					if (temp.temp_data.rateType == 'heart') {
						iconType = '&#9825;';
					}
					if (temp.temp_data.rateType == 'circle') {
						iconType = '&#9786;';
					}
					if (temp.temp_data.rateType == 'square') {
						iconType = '&#9744;';
					}
					var href_flag2 = temp.key_url + '_COL_' + encodeURIComponent(temp.temp_data.rateTemp[j].name) + '_COL_' + j + '_COL_' + temp.temp_data.rateTemp[j].link;
					var href_url2 = APP_SETTINGS.TARGET_URL + btoa(href_flag2);
					tempCode += '<p align="center" style="display: inline !important;vertical-align: middle;width: 47px;height: 45px;">';
					tempCode += '<a class="starIcon" href="' + href_url2 + '" onclick="javascript:for(var d = 0; d < ' + temp.temp_data.rateTemp.length + ';d ++){document.getElementsByClassName(\'starIcon\')[d].style.color = \'#8d949c\';}for(var i = 0; i < ' + rateValue + ';i ++){document.getElementsByClassName(\'starIcon\')[i].style.color = this.style.color == \'yellow\' ? \'#8d949c\' : \'yellow\';};"';
					tempCode +=' target="_blank" style="display: inline-block;color: #8d949c;font-size :500% !important; font-weight: normal; text-decoration: none;cursor: pointer;padding: 0 !important;margin-right: 2px;text-align: center;background-color: #fff;">';
					tempCode += iconType + '</a>';
					tempCode += '</p>';
				}
				tempCode += '</td></tr><tr><td><br/></td></tr><tr><td align="center" width="100%" style="padding: 3px 5%;">';
				tempCode += '<div style="float: left;font-weight: normal;color: #8d949c;font-size: 14px;">' + temp.temp_data.rateLabel.left + '</div>';
				tempCode += '<div style="float: right;font-weight: normal;color: #8d949c;">' + temp.temp_data.rateLabel.right + '</div>';
				tempCode += '</td></tr>';
			} else if (temp.section_id == 3) {
				tempCode += '<tr><td><br/><br/></td></tr><tr><td>';
				tempCode += '<table align="center" width="100%" border="0"><tr>';
				tempCode += '<td align="right" style="padding-right: 20px;">';
				var href_flag3 = temp.key_url + '_COL_' + temp.temp_data[0].name + '_COL_' + 0 + '_COL_' + temp.temp_data[0].link;
				var href_url3 = APP_SETTINGS.TARGET_URL + btoa(href_flag3);
				tempCode += '<a href="' + href_url3 + '" target="_blank" style="min-width: 100px;border-radius: 50px;color: #fff !important;background-color: #27c24c;border-color: #27c24c;font-weight: 500;outline: 0 !important;padding: 15px 25px;font-size: 18px;line-height: 1.3333333;text-align: center;cursor: pointer;text-decoration: none;display: inline-block;">';
				tempCode += temp.temp_data[0].name + '</a></td>';
				tempCode += '<td align="left" style="padding-left: 20px;">';
				href_flag3 = temp.key_url + '_COL_' + temp.temp_data[1].name + '_COL_' + 1 + '_COL_' + temp.temp_data[1].link;
				href_url3 = APP_SETTINGS.TARGET_URL + btoa(href_flag3);
				tempCode += '<a href="' + href_url3 + '" target="_blank" style="min-width: 100px;border-radius: 50px;color: #fff !important;background-color: #f05050;border-color: #f05050;font-weight: 500;outline: 0 !important;padding: 15px 25px;font-size: 18px;line-height: 1.3333333;text-align: center;cursor: pointer;text-decoration: none;display: inline-block;">';
				tempCode += temp.temp_data[1].name + '</a>';
				tempCode += '</td></tr></table></td></tr>';
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
