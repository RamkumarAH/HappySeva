'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state) {
        setTimeout(function() {
            $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state) {
        $scope.leftButton = "Skip";
        $scope.leftButtons = function (){
            $state.go('login');
        }

    })
