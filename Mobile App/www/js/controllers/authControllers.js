'use strict';
angular.module('happysevaApp.authControllers',[])
    .controller('LoginCtrl', function ($scope, $state, $cordovaNetwork, $rootScope, auth, $ionicLoading) {
        $scope.loginData ={};
        $scope.tryLogin = function(){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            if(isOnline){
                 auth.login($scope.loginData.useremail, $scope.loginData.password)
                    .success(function (res) {
                        if(res.status){
                            var data = JSON.stringify(res);
                           // alert('success ' + data + '!');
                            $ionicLoading.hide();
                            $state.go('menu.home');
                        }else{
                            $ionicLoading.hide();
                            alert('Error ' + res.msg + '!');
                        }
                    })
                    .error(function (err) {
                        alert('error1 = '+err);
                    });

            }else{
                $state.go('error');
            }

        }
        $scope.goto= function(Slacation){
            $state.go(Slacation);
        }
    })

    .controller('SignupCtrl', function ($scope, $state, auth, $ionicLoading ) {

        $scope.trySignup = function(){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.fullname =register.fullname.value;
            $scope.useremail = register.useremail.value;
            $scope.password = register.password.value;
            //alert($scope.fullname + ' '+ $scope.useremail +' '+ $scope.password);
                auth.register($scope.fullname, $scope.useremail, $scope.password)
                    .success(function (res) {
                        if(res.status){
                            var data = JSON.stringify(res);
                            //alert('success ' + data + '!');
                            $ionicLoading.hide();
                            $state.go('menu.home');
                        }else{
                            $ionicLoading.hide();
                            alert('Error ' + res.msg + '!');
                        }
                    })
                    .error(function () {
                        alert('warning');
                    });


        }
    });