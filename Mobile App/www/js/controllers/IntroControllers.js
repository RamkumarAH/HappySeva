'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state, CordovaNetwork) {
        setTimeout(function() {
           $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state, $cordovaNetwork, $rootScope) {
        //var type = $cordovaNetwork.getNetwork();
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

