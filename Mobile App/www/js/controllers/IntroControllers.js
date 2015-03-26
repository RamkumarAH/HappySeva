'use strict';
angular.module('happysevaApp.IntroControllers',[])
    .controller('SplashCtrl', function ($scope, $state, CordovaNetwork) {
        $scope.home_height = window.innerHeight;
        $scope.home_top = ($scope.home_height / 4);
        $scope.home_top = $scope.home_top - 40;
        setTimeout(function() {
           $state.go('intro');
        }, 3000)
    })
    .controller('IntroCtrl', function($scope, $state, $cordovaNetwork, $rootScope, mainService, $ionicLoading, $timeout, authToken) {
        $scope.title ='';
        $scope.content = '';
        $scope.getContent = function(){
           /* mainService.getAboutData().success(function(res){
                if(res.status){
                    $scope.title =res.data.page_title;
                    $scope.content = res.data.page_short_description;
                }
            })*/
        };
        $scope.title ='About us';
        $scope.content ='Welcome to Happy Seva.';
        $scope.SettingData ={APPLICATION_NAME:'',ADMIN_EMAIL:'',LOGO:'',NO_INTERNET:'',CONTACT_INFO:'',COPY_RIGHT:'',TOUR_SCREEN_1:'',TOUR_SCREEN_2:'',TOUR_SCREEN_3:'',TOUR_SCREEN_4:'',TOUR_SCREEN_5:'',TOUR_SCREEN_6:''};
        $scope.SettingData.TOUR_SCREEN_1 = 'img/HappySevaApp_white-Tour2.jpg';
        $scope.SettingData.TOUR_SCREEN_2 = 'img/HappySevaApp_white-Tour3.jpg';
        $scope.SettingData.TOUR_SCREEN_3 = 'img/HappySevaApp_white-Tour4.jpg';
        $scope.SettingData.TOUR_SCREEN_4 = 'img/HappySevaApp_white-Tour5.jpg';
        $scope.SettingData.TOUR_SCREEN_5 = 'img/HappySevaApp_white-Tour6.jpg';
        $scope.SettingData.TOUR_SCREEN_6 = 'img/HappySevaApp_white-Tour7.jpg';

        /*mainService.settingDefault().success(function(res){
            if(res.status){
                $scope.getContent();
                $scope.SettingData =  res.data;
                $ionicLoading.hide();
            }else{
                alert('error' + res.msg);
            }
        });*/


        $scope.leftButton = "Skip";
        $scope.contentH = window.innerHeight-64;
        $scope.leftButtons = function (){
            var token =authToken.getToken();
            if(token == null){
                $state.go('login');
            }else{
                var type = $cordovaNetwork.getNetwork();
                var isOnline = $cordovaNetwork.isOnline();
                if(isOnline) {
                    $state.go('menu.home');
                }else{
                    $state.go('error');
                }
            }

        };
        $scope.skip = 'Skip';
        $scope.slideHasChanged= function($index){
            if($index == 6){
                $scope.skip = 'Done';
            }else{
                $scope.skip = 'Skip';
            }

        }

    });

