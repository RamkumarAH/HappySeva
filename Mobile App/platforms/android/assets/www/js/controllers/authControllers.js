'use strict';
angular.module('happysevaApp.authControllers',[])
    .controller('LoginCtrl', function ($scope, $state) {
        $scope.tryLogin = function(){
            $state.go('menu.home');
        }
    })

    .controller('SignupCtrl', function ($scope, $state) {

    });