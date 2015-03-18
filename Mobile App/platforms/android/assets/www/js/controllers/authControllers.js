'use strict';
angular.module('happysevaApp.authControllers',[])
    .controller('LoginCtrl', function ($scope, $state, $cordovaNetwork, $rootScope, auth) {
        $scope.loginData ={};
        $scope.tryLogin = function(){
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            if(isOnline){
                alert($scope.loginData.useremail+ ' ' + $scope.loginData.password);
                auth.login($scope.loginData.useremail, $scope.loginData.password)
                    .success(function (res) {
                        if(res.status){
                            alert('success ' + res.data + '!');
                            $state.go('menu.home');
                        }else{
                            alert('Error ' + res.msg + '!');
                        }
                    })
                    .error(function () {
                        alert('error');
                    });

            }else{
                $state.go('error');
            }

        }
        $scope.goto= function(Slacation){
            $state.go(Slacation);
        }
    })

    .controller('SignupCtrl', function ($scope, $state, auth ) {

        $scope.trySignup = function(){
            $scope.fullname =register.fullname.value;
            $scope.useremail = register.useremail.value;
            $scope.password = register.password.value;
            alert($scope.fullname + ' '+ $scope.useremail +' '+ $scope.password);
                auth.register($scope.fullname, $scope.useremail, $scope.password)
                    .success(function (res) {
                        if(res.status){
                            alert('success ' + res.data + '!');
                            $state.go('menu.home');
                        }else{
                            alert('Error ' + res.msg + '!');
                        }
                    })
                    .error(function () {
                        alert('warning');
                    });


        }
    });