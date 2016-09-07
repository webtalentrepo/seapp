(function () {
    'use strict';
    angular.module('constants', [])
        .constant('APP_SETTINGS', {
            RESOURCE_DIR: '',
            // API_ROOT_URL: 'http://surveysforemail.net/api/',
            // SURVEY_URL: 'http://surveysforemail.net/survey/'
            API_ROOT_URL: 'http://localhost/theme_survey/src/api/',
	        SURVEY_URL: 'http://localhost/theme_survey/angular/survey/'
        })
        .constant('AUTH_EVENTS', {
            LOGIN_SUCCESS: '1',
            LOGIN_FAILURE: '2',
            LOGOUT_SUCCESS: '3',
            LOGOUT_FAILURE: '4',
            SESSION_TIMEOUT: '5',
            NOT_AUTHENTICATED: '6',
            ADMIN_SUCCESS: '7',
            ADMIN_FAILURE: '8'
        })
	    .constant('THEME_SETTINGS', {
		    themeID: 1,
		    navbarHeaderColor: 'bg-primary dker',
		    navbarCollapseColor: 'bg-light',
		    asideColor: 'bg-dark',
		    headerFixed: true,
		    asideFixed: true,
		    asideFolded: false,
		    asideDock: false,
		    container: false
	    });
})();