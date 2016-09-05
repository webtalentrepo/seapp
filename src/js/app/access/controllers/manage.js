'use strict';

app_access.controller('UserManageController', [
    '$scope', '$state', '$window', '$filter', 'AUTH_EVENTS', 'commonService', 'authModelService', 'toaster', 'editableOptions', 'editableThemes',
    function ($scope, $state, $window, $filter, AUTH_EVENTS, commonService, authModelService, toaster, editableOptions, editableThemes) {
        $scope.userInfo = $scope.user = commonService.getUserInfo();
        if ($scope.userInfo.login !== AUTH_EVENTS.LOGIN_SUCCESS) {
            commonService.setLoginFailed();
            $state.go('access.signin', {}, {reload: true});
        } else {
            commonService.setLoginSuccess(($scope.userInfo.is_admin === AUTH_EVENTS.ADMIN_SUCCESS));
        }
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        $window.sessionStorage.currentPage = 1;

        $scope.pageChanged = function (newPage) {
            $window.sessionStorage.currentPage = newPage;
        };
        if ($window.sessionStorage.currentPage) {
            $scope.pagination = {
                current: $window.sessionStorage.currentPage
            };
        } else {
            $scope.pagination = {
                current: 1
            };
        }

        var that = this;
        that.users = [];
        that.userStatus = [
            {value: "2", text: 'Yes'},
            {value: "1", text: 'No'}
        ];
        that.removeUser = removeUser;
        that.checkName = checkName;
        that.saveUser = saveUser;
        that.showFlag = showFlag;
        that.addUser = addUser;

        function getUserList() {
            authModelService.GetUserList().then(function (response) {
                var re = angular.fromJson(response);
                if (re.result === "success") {
                    that.users = re.data;
                }
            });
        }

        getUserList();
        function removeUser(user, index) {
            var i = (($window.sessionStorage.currentPage * 1 - 1) * 10) + index;
            if (user.id === "Auto") {
                that.users.splice(i, 1);
                return;
            }
            if (user.user_flag === "2") {
                return;
            }
            if (!confirm("Are you sure you want to delete this user?")) {
                return;
            }
            var data = {
                user_id: user.id
            };
            authModelService.DeleteUser(data).then(function (re) {
                that.users.splice(i, 1);
            });
        }

        function showFlag(user) {
            var selected = $filter('filter')(that.userStatus, {value: user.user_flag});
            return (user.user_flag == "2" && selected.length) ? selected[0].text : 'No';
        }

        function checkName(data, name) {
            if (data === "" || data === null || data === undefined) {
                return name + " is required.";
            } else {
                if (name === 'Password' && data.length < 8) {
                    return name + " must be a least 8 characters.";
                }
            }
        }

        function saveUser(data, id) {
            var save_data = data;
            save_data.id = id;
            authModelService.RegisterUser(save_data).then(function (response) {
                var re = angular.fromJson(response);
                if (re.result === "success") {
                    toaster.pop('success', "Success!", "User data has been saved.");
                    getUserList();
                } else {
                    toaster.pop('error', "Failure! User data was not saved. Please check entered values once again.");
                    getUserList();
                    console.log(re);
                }
            });
        }

        function addUser() {
            $scope.inserted = {
                id: 'Auto',
                first_name: '',
                last_name: '',
                user_email: '',
                user_password: '',
                user_flag: 1
            };
            that.users.push($scope.inserted);
            var currPage = Math.ceil((that.users.length / 10));
            $window.sessionStorage.currentPage = currPage;
            $scope.pagination = {
                current: $window.sessionStorage.currentPage
            };
        }

    }
]);