'use strict';
angular.module('happysevaApp.authControllers',[])
    .controller('LoginCtrl', function ($scope, $state, $cordovaNetwork , $rootScope) {
        $scope.tryLogin = function(){
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            if(isOnline){
                $state.go('menu.home');
            }else{
                $state.go('error');
            }

        }
    })

    .controller('SignupCtrl', function ($scope, $state) {

    });