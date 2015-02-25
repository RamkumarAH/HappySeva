'use strict';
angular.module('happyseaApp', ['ionic'])
    .config(function($urlRouterProvider ,$stateProvider, API_URL){
        $stateProvider
            .state('splash', {
                url: "/",
                templateUrl: "templates/splash.html",
                controller: 'SplashCtrl'
            })
            .state('menu', {url: "/home", abstract: true, templateUrl: "templates/menu.html"})
            /*.state('menu.login', {url: '/login', views: {'menuContent': {templateUrl: 'templates/login.html', controller: 'LoginCtrl'} }  })*/
            .state('login',{
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
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
            .state('signup',{
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: 'SignupCtrl'
            })
            /*.state('menu.intro', {url: '/intro', views: {'menuContent': {templateUrl: 'templates/intro.html', controller: 'IntroCtrl'} }  });*/
            .state('intro',{
                url: "/intro",
                templateUrl: "templates/intro.html",
                controller: 'IntroCtrl'
            });
        $urlRouterProvider.otherwise('/');
    })
    .constant('API_URL','http://localhost/api')
    .run(function($rootScope, $state, $window, $ionicPlatform){
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs).
            // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
            // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
            // useful especially with forms, though we would prefer giving the user a little more room
            // to interact with the app.
           /* if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();

            }*/

        });

    })