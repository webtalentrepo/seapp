'use strict';

app_access.controller('LockMeController', [
	'$scope', '$state', 'toaster', 'AUTH_EVENTS', 'commonService',
	function ($scope, $state, toaster, AUTH_EVENTS, commonService) {
		$scope.user = {};
		$scope.userInfo = commonService.getUserInfo();
		if ($scope.userInfo.login !== AUTH_EVENTS.LOGIN_SUCCESS) {
			commonService.setLoginFailed();
			$state.go('access.signin', {}, {reload: true});
		} else {
			commonService.setLoginSuccess(($scope.userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS));
		}

		$scope.user.password = "";
		$scope.unlock = function () {
			if ($scope.user.password === "" || $scope.user.password === null) {
				toaster.pop('warning', "Warning!", "Please insert your password.");
				return false;
			}
			// var calc_MD5 = calcMD5($scope.user.password);
			var calc_MD5 = $scope.user.password;
			if (calc_MD5 !== $scope.userInfo.user_password) {
				toaster.pop('error', "Error!", "Password is incorrect.");
				return false;
			}
			$state.go(window.localStorage.CURR_SRC);
		};
	}
]);