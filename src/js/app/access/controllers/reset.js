'use strict';

app_access.controller('ResetPasswordController', [
    '$scope', '$state', '$stateParams', '$cookies', 'AUTH_EVENTS', 'commonService', 'authModelService', 'THEME_SETTINGS',
    function ($scope, $state, $stateParams, $cookies, AUTH_EVENTS, commonService, authModelService, THEME_SETTINGS) {
        var set_param = {
            login: AUTH_EVENTS.LOGIN_FAILURE,
            is_admin: AUTH_EVENTS.ADMIN_FAILURE,
            user_email: '',
            user_password: '',
            first_name: '',
            last_name: '',
            tbl_flag: 1,
            settings: THEME_SETTINGS,
            LANG_KEY: 'en',
            photo: '',
	        token: ''
        };
        commonService.setUserInfo(set_param);

        $scope.retrieveKey = $stateParams.retrieveKey;
        $scope.user = {};
        $scope.isLoading = false;

        $scope.resetPassword = function () {
            if ($scope.user.password !== $scope.user.cPassword) {
                return false;
            }
            $scope.isLoading = true;
            var param = {
                retrieve_key: $scope.retrieveKey,
                user_password: $scope.user.password
            };
            authModelService.ResetPassword(param).then(function (re) {
                $scope.isLoading = false;
                var result = angular.fromJson(re);
                if (result.result === "success") {
                    var data = result.data;
                    var adminFlag = false;
                    var set_param1 = {
                        login: AUTH_EVENTS.LOGIN_SUCCESS,
                        is_admin: '',
                        user_email: data.user_email,
                        user_password: data.user_password,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        tbl_flag: data.tbl_flag,
                        LANG_KEY: data.lang_key,
                        photo: data.photo,
	                    token: data.token
                    };
                    if (data.settings !== "") {
                        set_param1.settings = angular.fromJson(data.settings);
                        $scope.app.settings = angular.fromJson(data.settings);
                    } else {
                        set_param1.settings = THEME_SETTINGS
                    }
                    if (data.user_flag === '1') {
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
                    console.log(result);
                }
            });
        };
    }]);