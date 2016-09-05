'use strict';

app_access.factory('authModelService', ['authRestService', function (authRestService) {
        return {
            Authentication: function (param) {
                return authRestService.userLogin().query(param).$promise.then(function (response) {
                    return response;
                });
            },
            RegisterUser: function (save_data) {
                return authRestService.registerUser().query(save_data).$promise.then(function (response) {
                    return response;
                })
            },
            RetrievePassword: function (param) {
                return authRestService.retrievePassword().query(param).$promise.then(function (response) {
                    return response;
                });
            },
            ResetPassword: function (param) {
                return authRestService.resetPassword().query(param).$promise.then(function (response) {
                    return response;
                });
            },
            SettingAccount: function (param) {
                return authRestService.settingAccount().query(param).$promise.then(function (response) {
                    return response;
                });
            },
            GetUserList: function () {
                return authRestService.getUserList().query().$promise.then(function (response) {
                    return response;
                });
            },
            DeleteUser: function (param) {
                return authRestService.deleteUser().query(param).$promise.then(function (response) {
                    return response;
                });
            },
            UploadPhoto: function (param) {
                return authRestService.uploadPhoto().query(param).$promise.then(function (response) {
                    return response;
                });
            },
	        SetEspFlag: function (param) {
		        return authRestService.setTableFlag().query(param).$promise.then(function (response) {
			        return response;
		        });
	        }
        };
    }])
    .service('userServiceAsync', ['$q', 'authRestService', function ($q, authRestService) {
        return {
            isDuplicateEmailAsync: function (email) {
                var deferred = $q.defer(), i;
                authRestService.getUserList().query().$promise.then(function (response) {
                    var re = angular.fromJson(response);
                    if (re.result === 'success') {
                        var users = re.data;
                        for (i = 0; i < users.length; i++) {
                            if (users[i].user_email === email) {
                                deferred.resolve(true);
                                return;
                            }
                        }
                        deferred.resolve(false);
                    } else {
                        deferred.resolve(false);
                    }
                });
                return deferred.promise;
            }
        };
    }]);