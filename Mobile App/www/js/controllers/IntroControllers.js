'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state, CordovaNetwork) {
        $scope.home_height = window.innerHeight;
        $scope.home_top = $scope.home_height / 3;
        setTimeout(function() {
           $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state, $cordovaNetwork, $rootScope, mainService, $ionicLoading, $timeout) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.SettingData ={APPLICATION_NAME:'',ADMIN_EMAIL:'',LOGO:'',NO_INTERNET:'',CONTACT_INFO:'',COPY_RIGHT:'',TOUR_SCREEN_1:'',TOUR_SCREEN_2:'',TOUR_SCREEN_3:'',TOUR_SCREEN_4:'',TOUR_SCREEN_5:'',TOUR_SCREEN_6:''};
        mainService.settingDefault().success(function(res){
            if(res.status){
                $scope.SettingData =  res.data;
                $ionicLoading.hide();
            }else{
                alert('error' + res.msg);
            }
        });


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

