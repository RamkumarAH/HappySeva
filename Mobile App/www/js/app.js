'use strict';
angular.module('happysevaApp', ['ionic','happysevaApp.IntroControllers','happysevaApp.authControllers','happysevaApp.homeControllers','happysevaApp.services'])
    .config(function($urlRouterProvider ,$stateProvider, API_URL, $httpProvider, $compileProvider){
        $stateProvider
            .state('splash', {
                url: "/",
                templateUrl: "templates/splash.html",
                controller: 'SplashCtrl'
            })
            .state('login',{
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })
            .state('signup',{
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: 'SignupCtrl'
            })
            .state('error',{
                url: "/error",
                templateUrl: "templates/Error.html",
                controller: 'ErrorCtrl'
            })
            .state('intro',{
                url: "/intro",
                templateUrl: "templates/intro.html",
                controller: 'IntroCtrl'
            })
            .state('menu', {
                url: "/menu",
                abstract: true,
                templateUrl: "templates/menu.html"
            })
            .state('menu.home',{
                url: "/home",
                views:{
                    'menuContent':
                        {
                            templateUrl: "templates/home.html",
                            controller: 'HomeCtrl'
                        }
                }
            })

            .state('menu.about',{
                url: "/about",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/about.html",
                        controller: 'AboutusCtrl'
                    }
                }
            })
            .state('menu.servicelist',{
                url: "/servicelist",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/servicelist.html",
                        controller: 'ServiceListCtrl'
                    }
                }
            })
            .state('menu.appointment',{
                url: "/appointment",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/appointment.html",
                        controller: 'AppointmentCtrl'
                    }
                }
            })
            .state('menu.servicenow',{
                url: "/servicenow",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/servicenow.html",
                        controller: 'ServiceNowCtrl'
                    }
                }
            })
            .state('menu.servicemap',{
                url: "/servicemap",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/servicemap.html",
                        controller: 'ServiceMapCtrl'
                    }
                }
            })
            .state('menu.thankyou',{
                url: "/thankyou",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/thankyou.html",
                        controller: 'ThankyouCtrl'
                    }
                }
            });

       // $httpProvider.interceptors.push('authInterceptor');
        $urlRouterProvider.otherwise('/');

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .constant('API_URL','http://localhost/api')
    .run(function($rootScope, $state, $window, $ionicPlatform ,$cordovaSplashscreen, $ionicPopup ,$cordovaNetwork){

        $ionicPlatform.ready(function() {
            $cordovaSplashscreen.splashscreen.hide();
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();

            }



        });

    })