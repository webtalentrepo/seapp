'use strict';

app.factory('commonService', [
    '$cookies', '$localStorage', '$window', '$rootScope',
    function ($cookies, $localStorage, $window, $rootScope) {
        return {
            getUserInfo: function () {
                return {
                    login: $window.sessionStorage.SV_login,
                    is_admin: $window.sessionStorage.SV_is_admin,
                    user_id: $window.sessionStorage.SV_user_id,
                    user_email: $window.sessionStorage.SV_user_email,
                    user_password: $window.sessionStorage.SV_user_password,
                    first_name: $window.sessionStorage.SV_first_name,
                    last_name: $window.sessionStorage.SV_last_name,
                    settings: $localStorage.settings,
                    photo: $window.sessionStorage.photo
                };
            },
            setUserInfo: function (param) {
	            $window.sessionStorage.SV_login = param.login;
	            $window.sessionStorage.SV_is_admin = param.is_admin;
	            $window.sessionStorage.SV_user_id = param.user_id;
	            $window.sessionStorage.SV_user_email = param.user_email;
	            $window.sessionStorage.SV_user_password = param.user_password;
	            $window.sessionStorage.SV_first_name = param.first_name;
	            $window.sessionStorage.SV_last_name = param.last_name;
	            $window.sessionStorage.photo = param.photo;
                $localStorage.settings = param.settings;
            },
            setLoginFailed: function () {
                $rootScope.isLogin = false;
                $rootScope.isAdmin = false;
            },
            setLoginSuccess: function (adminFlag) {
                $rootScope.isLogin = true;
                $rootScope.isAdmin = adminFlag;
            }
        };
    }
]);
