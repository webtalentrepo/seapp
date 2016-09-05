"use strict";

app_survey.factory('surveyRestService', [
	'$resource', 'APP_SETTINGS',
	function ($resource, APP_SETTINGS) {
		return {
			removeSurveyImage: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/removeimage', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			},
			saveSurveyData: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/savedata', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			},
			getSurveyData: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/getdata', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			},
			getSurveyDataById: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/getdatabyid', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			},
			deleteSurveyData: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/deletetemp', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			},
			cloneSurveyData: function () {
				return $resource(APP_SETTINGS.API_ROOT_URL + 'survey/clonedata', {}, {
					query: {
						method: 'POST',
						isArray: false
					}
				});
			}
		};
	}
]);
