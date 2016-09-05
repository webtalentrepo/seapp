'use strict';

// signup controller
app_access.controller('SignupFormController', ['$scope', '$state', 'authModelService',
    function ($scope, $state, authModelService) {
        $scope.user = {};
        $scope.authError = null;
        $scope.isLoading = false;

        var that = this;
        that.signup = signup;
        function signup() {
            $scope.authError = null;
            $scope.isLoading = true;
            var save_data = {
                id: 'Auto',
                first_name: $scope.user.first_name,
                last_name: $scope.user.last_name,
                user_email: $scope.user.email,
                user_password: $scope.user.password,
                user_flag: 1
            };
            authModelService.RegisterUser(save_data).then(function (response) {
                $scope.isLoading = false;
                var re = angular.fromJson(response);
                if (re.result === "success") {
                    $scope.authError = null;
                    $state.go('access.signin', {}, {reload: true});
                } else {
                    console.log(re.result);
                    $scope.authError = "Failure! New Account was not saved." + re.result;
                }
            });
        }
    }])
;