'use strict';

app_survey.controller('SelectGenerateController', [
	'$rootScope', '$state', '$stateParams', '$scope', '$localStorage', 'surveyModelService', 'AUTH_EVENTS', 'commonService', 'toaster',
	'editableOptions', 'editableThemes', 'FileUploader', 'APP_SETTINGS',
	function ($rootScope, $state, $stateParams, $scope, $localStorage, surveyModelService, AUTH_EVENTS, commonService, toaster,
	          editableOptions, editableThemes, FileUploader, APP_SETTINGS) {
		var userInfo = $rootScope.$$childHead.userInfo = commonService.getUserInfo();
		if (userInfo.login !== AUTH_EVENTS.LOGIN_SUCCESS) {
			commonService.setLoginFailed();
			$state.go('access.signin', {}, {reload: true});
		} else {
			commonService.setLoginSuccess((userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS));
		}
		editableThemes.bs3.inputClass = 'input-sm';
		editableThemes.bs3.buttonsClass = 'btn-sm';
		editableOptions.theme = 'bs3';
		var that = this;
		/**
		 * init common vars.
		 */
		that.saveComplete = false;
		that.key_url = $stateParams.key_url;
		that.temp_key = '';
		that.TempName = $localStorage.SE_tempName;
		that.sectionId = 1;
		that.SE_Type = $localStorage.SE_tempType;
		if ($localStorage.SE_tempType === 'NEW') {
			that.HeaderTitle = 'Create ';
			that.sectionId = that.key_url * 1;
			that.ImageAddAble = true;
			/**
			 * Section 1.
			 */
			that.TempButton = [];
			for (var i = 0; i < 3; i++) {
				that.TempButton[i] = {temp: ('Enter Info For Box #' + (i + 1)), name: ''};
			}
			/**
			 * Section 2
			 */
			that.TempRate = [];
			for (var j = 0; j < 5; j++) {
				that.TempRate[j] = {value: (j + 1), selected: false};
			}
			that.RateType = 'star';
			that.RateLabel = {};
			that.RateLabel.left = '';
			that.RateLabel.right = '';
			that.RateOptions = [
				{type: 'star'}, {type: 'square'}, {type: 'circle'}, {type: 'heart'}
			];
			/**
			 * Section 3
			 */
			that.answerButton = [];
			that.answerButton[0] = {temp: 'YES', name: ''};
			that.answerButton[1] = {temp: 'NO', name: ''};
		} else {
			that.HeaderTitle = 'Edit ';
			that.sectionId = $localStorage.SE_tempType * 1;
			var param = {
				id: that.key_url
			};
			surveyModelService.GetSurveyDataById(param).then(function (response) {
				var re = angular.fromJson(response);
				if (re.result === 'success') {
					that.temp_key = re.data.key_url;
					that.TempHeader = re.data.temp_header;
					that.TempHeader1 = re.data.temp_header1;
					var tempData = angular.fromJson(re.data.temp_data);
					if (that.sectionId === 1) {
						that.TempButton = tempData;
					} else if (that.sectionId === 2) {
						that.TempRate = tempData.rateTemp;
						that.RateType = tempData.rateType;
						that.RateLabel = tempData.rateLabel;
						that.RateOptions = tempData.rateOptions;
					} else if (that.sectionId === 3) {
						that.answerButton = tempData;
					}
					that.surveyImage = re.data.temp_image;
					that.surveyFileName = re.data.temp_file;
					if ((that.surveyImage != '' && that.surveyImage != null)) {
						that.ImageAddAble = false;
					} else if (that.surveyImage === '' || that.surveyImage === null) {
						that.ImageAddAble = true;
					}
				}
			});
		}
		that.TempHeader = '';
		that.TempHeader1 = '';
		that.embedLink = '';
		that.isLoading = false;
		
		$scope.checkTempEmpty = function (data) {
			if (data === "" || data === null || data === undefined) {
				return "Please fill out this field";
			}
		};
		
		/**
		 * Edit Survey stuff.
		 */
		$scope.previewSurvey = function () {
			if (that.sectionId === 2) {
				for (var i = 0; i < that.TempRate.length; i++) {
					that.TempRate[i].selected = false;
				}
			}
			$.fancybox({
				href: "#previewSurvey",
				width: 600,
				autoSize: false,
				scrolling: "auto"
			});
		};
		
		$scope.nextStep = function () {
			var messageArray = [
				'Please insert main headline.',
				'Please insert your products, services...',
				'Please insert your questions.'
			];
			if (that.TempHeader === '' || that.TempHeader === null || that.TempHeader === undefined) {
				toaster.pop('error', 'Error!', messageArray[(that.sectionId * 1 - 1)]);
				return false;
			}
			if ((that.sectionId * 1) === 1) {
				if (that.TempButton.length < 1) {
					toaster.pop('error', 'Error!', 'Please add one or more boxes.');
					return false;
				}
				for (var i = 0; i < that.TempButton.length; i++) {
					if (that.TempButton[i].name === '' || that.TempButton[i].name === null || that.TempButton[i].name === undefined) {
						var buttonError = 'Please ' + that.TempButton[i].temp;
						toaster.pop('error', 'Error!', buttonError);
						return false;
					}
				}
			} else if ((that.sectionId * 1) === 3) {
				for (var j = 0; j < that.answerButton.length; j++) {
					if (that.answerButton[j].name === '' || that.answerButton[j].name === null || that.answerButton[j].name === undefined) {
						var Error = 'Please insert answer buttons label.';
						toaster.pop('error', 'Error!', Error);
						return false;
					}
				}
			}
			var params = {
				user_id: userInfo.user_id,
				section_id: that.sectionId,
				temp_name: that.TempName,
				temp_header: that.TempHeader,
				temp_header1: that.TempHeader1,
				temp_image: that.surveyImage,
				temp_file: that.surveyFileName,
				key_url: that.temp_key
			};
			if ((that.sectionId * 1) === 1) {
				params.temp_data = that.TempButton
			} else if ((that.sectionId * 1) === 2) {
				var RateData = {
					rateTemp: that.TempRate,
					rateType: that.RateType,
					rateLabel: that.RateLabel,
					rateOptions: that.RateOptions
				};
				params.temp_data = RateData;
			} else if ((that.sectionId * 1) === 3) {
				params.temp_data = that.answerButton;
			}
			params.id = ($localStorage.SE_tempType === 'NEW') ? 'NEW' : that.key_url;
			that.saveComplete = false;
			that.isLoading = true;
			surveyModelService.SaveSurveyData(params).then(function (response) {
				var re = angular.fromJson(response);
				that.isLoading = false;
				if (re.result === 'success') {
					that.temp_key = re.file_key;
					that.key_url = re.id;
					that.sectionId = re.section_id;
					that.saveComplete = true;
					var embedSrc = APP_SETTINGS.SURVEY_URL + that.temp_key;
					that.embedLink = '<a href="#" style="width: 100%; height: 100%; display: inline-block;">';
					that.embedLink += '<iframe src="' + embedSrc + '" style="border: 0; width: 100%; height: 100%;"></iframe></a>';
				} else {
					toaster.pop('error', 'Error!', 'Failed on saving.');
				}
			});
		};
		
		$scope.clickText = function () {
			$("#embedLink").focus().select();
		};
		
		$scope.editSurvey = function () {
			that.saveComplete = false;
			$localStorage.SE_tempType = that.sectionId;
			that.HeaderTitle = 'Edit ' + that.TempName;
		};
		
		/**
		 * Section 1.
		 */
		$scope.addBoxes = function () {
			var addInfo = {temp: ('Enter Info For Box #' + (that.TempButton.length + 1)), name: ''};
			that.TempButton.push(addInfo);
		};
		
		$scope.delBoxes = function (index) {
			that.TempButton.splice(index, 1);
		};
		
		/**
		 * Section 2
		 */
		that.RateMin = 3;
		that.RateMax = 10;
		that.rateClass = rateClass;
		function rateClass(tempItem) {
			if (tempItem.selected) {
				return 'fa-' + that.RateType + ' selected-rate';
			} else {
				return 'fa-' + that.RateType + '-o';
			}
		}
		
		$scope.removeRate = function () {
			that.TempRate.splice((that.TempRate.length - 1), 1);
		};
		$scope.addRate = function () {
			var addInfo = {value: (that.TempRate.length + 1), selected: false};
			that.TempRate.push(addInfo);
		};
		
		/**
		 * Image Add stuff.
		 */
		that.urlLink = "";
		that.surveyImage = '';
		that.surveyFileName = '';
		$scope.uploadUrl = APP_SETTINGS.API_ROOT_URL + 'survey/uploadimage';
		that.uploader = new FileUploader({
			url: $scope.uploadUrl,
			formData: [
				{user_id: userInfo.user_id}
			]
		});
		that.chooseFile = chooseFile;
		function chooseFile() {
			$.fancybox({
				href: "#add_image",
				modal: true,
				width: 800,
				height: 650,
				autoSize: false,
				scrolling: "no"
			});
		}
	}]
);

