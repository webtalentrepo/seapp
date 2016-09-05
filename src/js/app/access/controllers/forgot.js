'use strict';

app_access.controller('ForgotPassController', [
    '$scope', 'authModelService',
    function ($scope, authModelService) {
        $scope.emailFailure = false;
        $scope.emailSuccess = false;
        $scope.isLoading = false;
        $scope.UserEmail = "";
        $scope.SendMail = function () {
            if ($scope.UserEmail === '') {
                $scope.emailFailure = true;
                $scope.emailSuccess = false;
                return;
            }
            $scope.isLoading = true;
            var param = {
                user_email: $scope.UserEmail
            };
            authModelService.RetrievePassword(param).then(function (re) {
                var result = angular.fromJson(re);
                $scope.isLoading = false;
                if (result.result === "success") {
                    $scope.emailFailure = false;
                    $scope.emailSuccess = true;
                } else {
                    $scope.emailFailure = true;
                    $scope.emailSuccess = false;
                    console.log(result);
                }
            });
        }
    }]);