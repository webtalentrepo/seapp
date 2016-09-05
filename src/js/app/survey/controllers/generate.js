'use strict';

app_survey.controller('SelectGenerateController', [
	'$rootScope', '$state', '$stateParams', '$scope', '$window', '$localStorage', 'surveyModelService', 'AUTH_EVENTS', 'commonService', 'toaster',
	'editableOptions', 'editableThemes', 'FileUploader', 'APP_SETTINGS',
	function ($rootScope, $state, $stateParams, $scope, $window, $localStorage, surveyModelService, AUTH_EVENTS, commonService, toaster,
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
					if (that.sectionId === 1) {
						that.TempButton = re.data.temp_data;
					}
					that.surveyImage = re.data.temp_image;
					that.surveyFileName = re.data.temp_file;
					if (that.surveyImage != '' && that.surveyImage != null) {
						that.ImageAddAble = false;
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
				'Please insert your products, services...'
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
					var embedSrc = $window.location.origin + '/survey/' + that.temp_key;
					that.embedLink = '<a href=""><iframe src="' + embedSrc + '" style="border: 0; width: 100%; height: 100%;"></iframe></a>';
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
		that.TempButton = [];
		for (var i = 0; i < 3; i ++) {
			that.TempButton[i] = {temp: ('Enter Info For Box #' + (i + 1)), name: ''};
		}
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
		that.TempRate = [];
		that.RateType = 'fa-star';
		for (var j = 0; j < 5; j ++) {
			that.TempRate[j] = {value: (j + 1), selected: false};
		}
		$scope.rateClass = function (tempItem) {
			if (tempItem.selected) {
				return that.RateType + 'selected-rate';
			} else {
				return that.RateType + '-o';
			}
		};
		
		/**
		 * Image Add stuff.
		 */
		that.ImageAddAble = true;
		that.urlLink = "";
		that.surveyImage = '';
		that.surveyFileName = '';
		$scope.clickObj = 'computer';
		$scope.chooseFile = function () {
			$.fancybox({
				href: "#add_image",
				modal: true,
				width: 800,
				height: 550,
				autoSize: false,
				scrolling: "no"
			});
		};
		$scope.closeModal = function () {
			that.urlLink = "";
			uploader.clearQueue();
			$scope.clickObj = 'computer';
			that.surveyImage = '';
			that.surveyFileName = '';
			that.ImageAddAble = true;
			$.fancybox.close();
		};
		$scope.navClick = function (flag) {
			$scope.clickObj = flag;
		};
		$scope.navActive = function (flag) {
			return $scope.clickObj === flag;
		};
		
		$scope.uploadUrl = APP_SETTINGS.API_ROOT_URL + 'survey/uploadimage';
		var uploader = $scope.uploader = new FileUploader({
			url: $scope.uploadUrl,
			formData: [
				{user_id: userInfo.user_id}
			]
		});
		uploader.filters.push({
			name: 'imageFilter',
			fn: function (item /*{File|FileLikeObject}*/, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|jpeg|png|bmp|gif|'.indexOf(type) !== -1;
			}
		});
		uploader.filters.push({
			name: 'customFilter',
			fn: function (item /*{File|FileLikeObject}*/, options) {
				return this.queue.length < 1;
			}
		});
		uploader.onCompleteItem = function (fileItem, response, status, headers) {
			if (response == "" || response == null || response.length < 1) {
				toaster.pop('error', 'Error!', 'File Upload is failed.');
				uploader.clearQueue();
				return;
			}
			var re = angular.fromJson(response);
			if (re.result === 'success') {
				$scope.closeModal();
				that.surveyImage = APP_SETTINGS.API_ROOT_URL + 'uploads/survey/' + re.file_name;
				that.surveyFileName = re.file_name;
				that.ImageAddAble = false;
			}
			uploader.clearQueue();
		};
		
		angular.element(document.querySelector('#fileinput-button')).on('click', function () {
			$("#fileUploader").trigger("click");
		});
		$scope.startUpload = function () {
			uploader.uploadAll();
		};
		$scope.applyImage = function () {
			that.surveyImage = that.urlLink;
			that.ImageAddAble = false;
			that.urlLink = "";
			uploader.clearQueue();
			$scope.clickObj = 'computer';
			that.surveyFileName = '';
			$.fancybox.close();
		};
		$scope.removeImage = function () {
			if (that.surveyFileName === '' || that.surveyFileName === null) {
				that.surveyImage = '';
				that.ImageAddAble = true;
				return;
			}
			var param = {
				file_name: that.surveyFileName
			};
			surveyModelService.RemoveSurveyImage(param).then(function (re) {
				that.surveyImage = '';
				that.surveyFileName = '';
				that.ImageAddAble = true;
			});
		};
	}]
);
