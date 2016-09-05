'use strict';

app_survey.factory('surveyModelService', ['surveyRestService', function (surveyRestService) {
	return {
		RemoveSurveyImage: function (param) {
			return surveyRestService.removeSurveyImage().query(param).$promise.then(function (response) {
				return response;
			});
		},
		SaveSurveyData: function (param) {
			return surveyRestService.saveSurveyData().query(param).$promise.then(function (response) {
				return response;
			});
		},
		GetSurveyData: function (param) {
			return surveyRestService.getSurveyData().query(param).$promise.then(function (response) {
				return response;
			});
		},
		GetSurveyDataById: function (param) {
			return surveyRestService.getSurveyDataById().query(param).$promise.then(function (response) {
				return response;
			});
		},
		DeleteSurveyData: function (param) {
			return surveyRestService.deleteSurveyData().query(param).$promise.then(function (response) {
				return response;
			});
		},
		CloneSurveyData: function (param) {
			return surveyRestService.cloneSurveyData().query(param).$promise.then(function (response) {
				return response;
			});
		}
	};
}]);
