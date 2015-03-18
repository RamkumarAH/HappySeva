'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state, CordovaNetwork) {
        $scope.home_height = window.innerHeight;
        $scope.home_top = $scope.home_height / 3;
        setTimeout(function() {
           $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state, $cordovaNetwork, $rootScope) {
        $scope.leftButton = "Skip";
        $scope.contentH = window.innerHeight-64;
        $scope.leftButtons = function (){
            $state.go('login');
        };
        $scope.skip = 'Skip';
        $scope.slideHasChanged= function($index){
            if($index == 6){
                $scope.skip = 'Done';
            }else{
                $scope.skip = 'Skip';
            }

        }

    })

