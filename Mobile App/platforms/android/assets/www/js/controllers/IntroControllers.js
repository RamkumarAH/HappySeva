'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state, CordovaNetwork) {
        setTimeout(function() {
           $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state) {
        $scope.leftButton = "Skip";
        $scope.contentH = window.innerHeight-64;
        $scope.leftButtons = function (){
            $state.go('login');
        }

    })

