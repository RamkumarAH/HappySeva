'use strict';
angular.module('happysevaApp', ['ionic','happysevaApp.IntroControllers','happysevaApp.authControllers','happysevaApp.homeControllers','happysevaApp.services','happysevaApp.ng-cordova_services'])
    .constant('API_URL','http://www.webenza.in/happy-seva/services')
    .constant('map','map')
    .run(function($rootScope, $state, $window, $ionicPlatform ,$cordovaSplashscreen, $ionicPopup ,$cordovaNetwork){
        $ionicPlatform.ready(function() {
            $cordovaSplashscreen.splashscreen.hide();
            document.removeEventListener("backbutton", function(){
            }, false);
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();

            }

        });
        $ionicPlatform.onHardwareBackButton(function () {
            if(true) { // your check here
                $ionicPopup.confirm({
                    title: 'System warning',
                    template: 'are you sure you want to exit?'
                }).then(function(res){
                    if( res ){
                        navigator.app.exitApp();
                    }
                })
            }
        });
    })
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
            .state('model',{
                url: "/model",
                templateUrl: "templates/my-model.html"

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
            .state('menu.order',{
                url: "/order",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/order.html",
                        controller: 'OrderCtrl'
                    }
                }
            })
            .state('menu.profile',{
                url: "/profile",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/profile.html",
                        controller: 'ProfileCtrl'
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
            .state('menu.privacy',{
                url: "/privacy",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/privacy.html",
                        controller: 'PrivacyCtrl'
                    }
                }
            })
            .state('menu.support',{
                url: "/support",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/support.html",
                        controller: 'SupportCtrl'
                    }
                }
            })
            .state('menu.faq',{
                url: "/faq",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/faq.html",
                        controller: 'FaqCtrl'
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
                url: "/thankyou/",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/thankyou.html",
                        controller: 'ThankyouCtrl'
                    }
                }
            })
            .state('menu.thankyou-details',{
                url: "/thankyou/:vendorId",
                views:{
                    'menuContent':
                    {
                        templateUrl: "templates/thankyou.html",
                        controller: 'ThankyouDetailsCtrl'
                    }
                }
            });

       // $httpProvider.interceptors.push('authInterceptor');
        $urlRouterProvider.otherwise('/');
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                }
            }
            return result.join("&");
        });
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    });
