'use strict';
angular.module('happysevaApp.authControllers', [])
    .controller('LoginCtrl', function ($scope, $state, $cordovaNetwork, $rootScope, auth, $ionicLoading, $cordovaToast) {
        $scope.loginData = {};
        $scope.tryLogin = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            if (isOnline) {
                auth.login($scope.loginData.useremail, $scope.loginData.password)
                    .success(function (res) {
                        if (res.status) {
                            var data = JSON.stringify(res);
                            $ionicLoading.hide();
                            $state.go('menu.home');
                        } else {
                            $ionicLoading.hide();
                            $cordovaToast.show(res.msg, 'long', 'bottom');
                        }
                    })
                    .error(function (err) {
                        $cordovaToast.show(err, 'long', 'bottom');
                    });

            } else {
                $ionicLoading.hide();
                $state.go('error');
            }

        };
        $scope.goto = function (Slacation) {
            $state.go(Slacation);
        };
        $scope.logout = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            auth.Logout().success(function (res) {
                if (res.status) {
                    $ionicLoading.hide();
                    $state.go('login');
                } else {
                    $ionicLoading.hide();

                    $cordovaToast.show('Logout Failed', 'long', 'bottom');
                }
            })
        }
    })

    .controller('SignupCtrl', function ($scope, $state, auth, $ionicLoading, $cordovaToast) {

        $scope.trySignup = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.fullname = register.fullname.value;
            $scope.useremail = register.useremail.value;
            $scope.password = register.password.value;
            //alert($scope.fullname + ' '+ $scope.useremail +' '+ $scope.password);
            auth.register($scope.fullname, $scope.useremail, $scope.password)
                .success(function (res) {
                    if (res.status) {
                        var data = JSON.stringify(res);
                        //alert('success ' + data + '!');
                        $ionicLoading.hide();
                        $state.go('menu.home');
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');

                    }
                })
                .error(function () {
                    $cordovaToast.show('Registration failed', 'long', 'bottom');

                });


        }
    })
    .controller('ForgotPasswordCtrl', function ($scope, $state, $cordovaNetwork, $rootScope, auth, $ionicLoading, $cordovaToast) {
        $scope.loginData = {};
        $scope.forgotPass = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            if (isOnline) {
                auth.forgotPassword($scope.loginData.useremail)
                    .success(function (res) {
                        if (res.status) {
                            $cordovaToast.show(res.msg, 'long', 'bottom');
                            $ionicLoading.hide();
                            $state.go('menu.login');
                        } else {
                            $ionicLoading.hide();
                            $cordovaToast.show(res.msg, 'long', 'bottom');
                        }
                    })
                    .error(function (err) {
                        $cordovaToast.show(err, 'long', 'bottom');
                    });

            } else {
                $ionicLoading.hide();
                $state.go('error');
            }

        };
    });