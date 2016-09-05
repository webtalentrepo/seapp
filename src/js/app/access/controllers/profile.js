'use strict';

app_access.controller('ProfileController', [
    '$scope', '$state', 'AUTH_EVENTS', 'commonService', 'authModelService', 'toaster', 'editableOptions', 'editableThemes',
    function ($scope, $state, AUTH_EVENTS, commonService, authModelService, toaster, editableOptions, editableThemes) {
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
        $scope.user.new_password = "";
        $scope.user.confirm_password = "";
        $scope.isLoading = false;

        $scope.passwordFilter = function (pwd) {
            var p = '';
            for (var i = 0; i < pwd.length; i++) {
                p += '•';
            }
            if (p === '') {
                p = '••••••••';
            }
            return p;
        };

        $scope.saveProfile = function () {
            if ($scope.user.new_password !== $scope.user.confirm_password) {
                $scope.user.new_password = "";
                $scope.user.confirm_password = "";
                toaster.pop('warning', "Warning!", "New Password and Confirm Password do not match.");
                return false;
            }
            if ($scope.user.new_password != "" && $scope.user.new_password.length < 8) {
                $scope.user.new_password = "";
                $scope.user.confirm_password = "";
                toaster.pop('warning', "Warning!", "Your password must be a least 8 characters.");
                return false;
            }
            if ($scope.user.first_name === "" || $scope.user.first_name === null) {
                toaster.pop('warning', "Warning!", "Please insert your first name.");
                return false;
            }
            if ($scope.user.last_name === "" || $scope.user.last_name === null) {
                toaster.pop('warning', "Warning!", "Please insert your last name.");
                return false;
            }
            if ($scope.user.user_email === "" || $scope.user.user_email === null) {
                toaster.pop('warning', "Warning!", "Please insert your login email.");
                return false;
            }
            if ($scope.user.new_password !== '' && $scope.user.new_password !== null) {
                $scope.user.user_password = $scope.user.new_password;
            }
            $scope.isLoading = true;
            var param = {
                first_name: $scope.user.first_name,
                last_name: $scope.user.last_name,
                user_email: $scope.user.user_email,
                user_password: $scope.user.user_password,
                user_id: $scope.user.user_id
            };
            authModelService.SettingAccount(param).then(function (re) {
                $scope.isLoading = false;
                if (re.result === "success") {
	                var set_param = $scope.user;
                    commonService.setUserInfo(set_param);
                } else {
                    toaster.pop('error', "Error!", re);
                }
            });
        };

        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.cropType = "circle";

        var handleFileSelect = function (evt) {
            var d = document.getElementById("fileInput");
            var c = d.files[0];
            var e = /image.*/;
            if (c.type.match(e)) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $.fancybox({
                        href: "#select-photo",
                        modal: true,
                        width: 500,
                        height: 380,
                        autoSize: false,
                        scrolling: "no",
                        afterShow: function () {
                            $scope.$apply(function ($scope) {
                                $scope.myImage = evt.target.result;
                            });
                            $("#valid-image").unbind("click");
                            angular.element(document.querySelector('#valid-image')).on('click', function () {
                                $scope.user.photo = $scope.myCroppedImage;
                                var params = {
                                    user_id: $scope.user.user_id,
                                    photo: $scope.user.photo
                                };
                                authModelService.UploadPhoto(params).then(function (re) {
                                    var r = angular.fromJson(re);
                                    if (r.result === "success") {
                                        $(".profile-photo").attr("src", $scope.user.photo);
                                    }
                                });
                                parent.$.fancybox.close();
                            });
                            $("#refuse-image").unbind("click");
                            angular.element(document.querySelector('#refuse-image')).on('click', function () {
                                $("#fileInput").val('');
                                $scope.myImage = '';
                                $scope.myCroppedImage = '';
                                parent.$.fancybox.close();
                            });
                        }
                    });
                };
                reader.readAsDataURL(file);
            } else {
                toaster.pop('warning', "Warning!", "File not compatible.");
            }
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        $scope.selectFile = function () {
            $("#fileInput").trigger("click");
        };
    }
]);