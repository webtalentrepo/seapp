'use strict';

app_survey
	.directive('templatePreview', function () {
		return {
			restrict: "E",
			templateUrl: "tpl/app/survey/preview_template.html",
			scope: {
				data: "="
			},
			link: function ($scope, $element, $attrs) {
				$scope.RateScore = function (index) {
					for (var i = 0; i < $scope.data.TempRate.length; i++) {
						$scope.data.TempRate[i].selected = false;
					}
					for (var j = 0; j < (index + 1); j++) {
						$scope.data.TempRate[j].selected = true;
					}
				};
			}
		}
	})
	.directive('surveyPreview', function () {
		return {
			restrict: "E",
			templateUrl: "tpl/app/survey/preview_survey.html",
			scope: {
				data: "="
			},
			link: function (scope, $element, $attrs) {
				if (scope.data) {
					if (scope.data.temp_data.rateTemp !== null && scope.data.temp_data.rateTemp !== undefined) {
						for (var i = 0; i < scope.data.temp_data.rateTemp.length; i++) {
							scope.data.temp_data.rateTemp[i].selected = false;
						}
					}
				}
				scope.RateScore = function (index) {
					for (var i = 0; i < scope.data.temp_data.rateTemp.length; i++) {
						scope.data.temp_data.rateTemp[i].selected = false;
					}
					for (var j = 0; j < (index + 1); j++) {
						scope.data.temp_data.rateTemp[j].selected = true;
					}
				};
				scope.RateIcon = function (tempItem) {
					if (tempItem.selected) {
						return 'fa-' + scope.data.temp_data.rateType + ' selected-rate';
					} else {
						return 'fa-' + scope.data.temp_data.rateType + '-o';
					}
				};
			}
		}
	})
	.directive('uploaderImage', ['toaster', 'APP_SETTINGS', '$q',
		function (toaster, APP_SETTINGS, $q) {
			return {
				restrict: "E",
				templateUrl: "tpl/app/survey/uploader_image.html",
				scope: {
					data: "="
				},
				link: function ($scope, $element, $attrs) {
					$scope.clickObj = 'computer';
					var uploader = $scope.data.uploader;
					$scope.navClick = function (flag) {
						$scope.clickObj = flag;
					};
					$scope.navActive = function (flag) {
						return $scope.clickObj === flag;
					};
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
							$scope.data.surveyImage = APP_SETTINGS.API_ROOT_URL + 'uploads/survey/' + re.file_name;
							$scope.data.surveyFileName = re.file_name;
							$scope.data.ImageAddAble = false;
						}
						uploader.clearQueue();
					};
					
					angular.element(document.querySelector('#fileinput-button')).on('click', function () {
						$("#fileUploader").trigger("click");
					});
					
					$scope.startUpload = function () {
						uploader.uploadAll();
					};
					
					$scope.imgUrl = '';
					$scope.imageLoading = true;
					$scope.imageLoadFailure = false;
					function isUrl(s) {
						var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
						return regexp.test(s);
					}
					
					$scope.$watch(function () {
						return $scope.data.urlLink;
					}, function (nv, ov) {
						if (nv != '' && isUrl(nv) && nv != ov) {
							$scope.imgUrl = '';
							$scope.imageLoading = true;
							$scope.imageLoadFailure = false;
							preLoadImage(nv).then(function (re) {
								$scope.imageLoading = false;
								$scope.imageLoadFailure = false;
								$scope.imgUrl = nv;
							}, function (re1) {
								$scope.imageLoading = false;
								$scope.imageLoadFailure = true;
							});
						}
					}, true);
					function preLoadImage(url) {
						return $q(function (resolve, reject) {
							var img = new Image();
							img.src = url;
							img.addEventListener('load', function () {
								resolve(true);
							});
							img.addEventListener('error', function () {
								reject(true);
							});
						});
					}
					
					$scope.applyImage = function () {
						$scope.data.surveyImage = $scope.data.urlLink;
						$scope.data.ImageAddAble = false;
						$scope.data.urlLink = "";
						uploader.clearQueue();
						$scope.clickObj = 'computer';
						$scope.data.surveyFileName = '';
						$.fancybox.close();
					};
					
					$scope.closeModal = function () {
						$scope.data.urlLink = "";
						uploader.clearQueue();
						$scope.clickObj = 'computer';
						$scope.data.surveyImage = '';
						$scope.data.surveyFileName = '';
						$scope.data.ImageAddAble = true;
						$.fancybox.close();
					};
				}
			}
		}
	])
	.directive('tempHeader', ['surveyModelService', function (surveyModelService) {
		return {
			restrict: "E",
			templateUrl: "tpl/app/survey/temp_header.html",
			scope: {
				data: "=",
				placeholder: "@"
			},
			link: function ($scope, $element, $attrs) {
				$scope.removeImage = function () {
					if ($scope.data.surveyFileName === '' || $scope.data.surveyFileName === null) {
						$scope.data.surveyImage = '';
						$scope.data.ImageAddAble = true;
						return;
					}
					var param = {
						file_name: $scope.data.surveyFileName
					};
					surveyModelService.RemoveSurveyImage(param).then(function (re) {
						$scope.data.surveyImage = '';
						$scope.data.surveyFileName = '';
						$scope.data.ImageAddAble = true;
					});
				};
			}
		};
	}]);