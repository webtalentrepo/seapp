'use strict';

/* Controllers */
app_access.controller('SigninFormController', [
    '$scope', '$state', 'AUTH_EVENTS', 'commonService', 'authModelService', 'THEME_SETTINGS',
    function ($scope, $state, AUTH_EVENTS, commonService, authModelService, THEME_SETTINGS) {
        $scope.user = {};
        $scope.authError = null;
        var set_param = {
            login: AUTH_EVENTS.LOGIN_FAILURE,
            is_admin: AUTH_EVENTS.ADMIN_FAILURE,
            user_id: 0,
            user_email: '',
            user_password: '',
            first_name: '',
            last_name: '',
	        settings: THEME_SETTINGS,
	        tbl_flag: 1,
            LANG_KEY: 'en',
            photo: ''
        };
        commonService.setUserInfo(set_param);
        $scope.isLoading = false;
        $scope.login = function () {
            var param = {
                UserEmail: $scope.user.email,
                UserPassword: $scope.user.password
            };
            $scope.authError = null;
            $scope.isLoading = true;
            authModelService.Authentication(param).then(function (response) {
                var re = angular.fromJson(response);
                $scope.isLoading = false;
                if (re.result === 'success') {
                    var adminFlag = false;
                    var data = re.data;
                    var set_param1 = {
                        login: AUTH_EVENTS.LOGIN_SUCCESS,
                        is_admin: '',
                        user_id: data.u_id,
                        user_email: data.u_email,
                        user_password: data.u_password,
                        first_name: data.u_fname,
                        last_name: data.u_lname,
	                    tbl_flag: data.tbl_flag,
	                    LANG_KEY: 'en',
                        photo: data.photo
                    };
                    set_param1.settings = THEME_SETTINGS;
	                $scope.app.settings = set_param1.settings;
                    if (data.account_type === '2') {
                        set_param1.is_admin = AUTH_EVENTS.ADMIN_SUCCESS;
                        commonService.setUserInfo(set_param1);
                        adminFlag = true;
                    } else {
                        adminFlag = false;
                        set_param1.is_admin = AUTH_EVENTS.ADMIN_FAILURE;
                        commonService.setUserInfo(set_param1);
                    }
                    commonService.setLoginSuccess(adminFlag);
                    $scope.isLoading = false;
                    $state.go('app.survey.dashboard', {}, {reload: true});
                } else {
                    $scope.authError = 'Email or Password is incorrect.';
                }
            });
        };
    }
]);
