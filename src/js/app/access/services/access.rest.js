'use strict';

app_access.factory('authRestService', ['$resource', 'APP_SETTINGS', function ($resource, APP_SETTINGS) {
    return {
        userLogin: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/login', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        getUserList: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/getuserlist', {}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        },
        registerUser: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/register', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        retrievePassword: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/retrieve', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        resetPassword: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/reset', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        settingAccount: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/setting', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        deleteUser: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/deleteuser', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
        uploadPhoto: function () {
            return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/uploadphoto', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            });
        },
	    setTableFlag: function () {
		    return $resource(APP_SETTINGS.API_ROOT_URL + 'auth/setesp', {}, {
			    query: {
				    method: 'POST',
				    isArray: false
			    }
		    });
	    }
    };
}]);