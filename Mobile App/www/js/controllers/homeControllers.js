angular.module('happysevaApp.homeControllers',[])
    .controller('MainCtrl', function($scope, $state, $ionicSideMenuDelegate) {
        if($state.current.name == 'menu.home'){
             $scope.leftButton = "ion-home";
        }else if($state.current.name == 'menu.appointment'){
            $scope.leftButton = "ion-gear-b";
        }else{
            $scope.leftButton = "ion-gear-b";
        }
        $scope.getClass = function() {
            $scope.class = "ion-home";
            return $scope.class;
        };

    })
    .controller('HomeCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaGeolocation , $rootScope) {
        $scope.home_height = window.innerHeight;
        $scope.home_width = window.innerWidth;
        $scope.home_top = $scope.home_height / 3;
        var temp = ($scope.home_height / 4);
        $scope.home_left =  (temp / 2)- 3;

        $scope.leftButton = "ion-home";
        $scope.subService = function(category){
            $scope.setPosition();
            mainService.setCategory(category);
            $state.go('menu.servicelist');
        };
        $scope.pagerClick = function(index){
            alert(index);
        };
        $scope.setPosition = function(){
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat  = position.coords.latitude;
                    var long = position.coords.longitude;
                   // alert(lat + ' '+ long);
                    localStorage.setItem("currentLat", lat);
                    localStorage.setItem("currentLong", long);
                }, function(err) {
                    // error
                });
        };



    })
    //ServiceListCtrl
    .controller('ServiceListCtrl', function ($scope, $state, mainService, $ionicPopup) {
        $scope.service={
            category:'',
            list:''
        }
        $scope.showAlert = function(name) {
            var alertPopup = $ionicPopup.alert({
                title: name+ ' Service',
                template: 'This service will begin shortly'
            });
            alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        $scope.service.category = mainService.category;
        $scope.service.list = mainService.subServices($scope.service.category)
        $scope.gotoService = function (name, status) {
            if(status =='no'){
                $scope.showAlert(name);
            }else{
                mainService.setServiceName(name);
                $state.go('menu.appointment');
            }

        }

    })
    //OrderCtrl
    .controller('OrderCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, $ionicLoading, $timeout){
        $scope.orderlist= {orderDate:'', orderId:'', stutas:'', vender:''};
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $timeout(function () {
            $ionicLoading.hide();
            $scope.orderlist = mainService.getOrderList();
            console.log($scope.orderlist);
        }, 2000);
    })
    //ProfileCtrl
    .controller('ProfileCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.fullname= 'Ramkumar';
        $scope.email ="ramkumar@gmail.com";

    })
    //ErrorCtrl
    .controller('ErrorCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.contentH = window.innerHeight-44;


    })
    //ThankyouCtrl
    .controller('ThankyouCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.contentH = window.innerHeight-44;
        $scope.serviceName = mainService.currentServiceName;

    })
    .controller('MenuCtrl', function ($scope, $state) {

    })

    .controller('AboutusCtrl', function($scope, $state){
        $scope.contentH = window.innerHeight-64;
        $scope.skip = 'Skip';
        $scope.slideHasChanged= function($index){
            if($index == 6){
                $scope.skip = 'Done';
            }else{
                $scope.skip = 'Skip';
            }

        }
    })
    .controller('AppointmentCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, Camera){
       // $state.go($state.current, {}, {reload: true});

        $scope.leftButton = "ion-gear-b";
        $scope.serviceName = mainService.currentServiceName;
        var date = new Date();
        $scope.appointmenttime = date;
        $scope.makeAppointment = function(){
            console.log('app is done');
            $state.go('menu.servicenow');
        };
        $scope.lastPhoto='';
        $scope.getPhoto = function(){
            console.log('upload img');
            var options = {
                quality: 45,
                targetWidth: 1000,
                targetHeight: 1000,
                saveToPhotoAlbum: false,
                allowEdit : true,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                /*sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
                popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)*/

            };
            Camera.getPicture().then(function (imageURI) {
                console.log(imageURI);
                $scope.lastPhoto =  imageURI;
            }, function (err) {
                console.err(err);
            }, options);

        };
    })
    .controller('ServiceNowCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.serviceName = mainService.currentServiceName;
        $scope.serviceNow = function (){
            $state.go('menu.thankyou');
        }

    })
    .controller('ServiceMapCtrl',function($scope, $window, $state, $ionicPlatform, $location, $ionicSideMenuDelegate, mainService ,$ionicLoading, $compile, $cordovaNetwork, $rootScope, $cordovaGeolocation){

        var isOnline = $cordovaNetwork.isOnline();

        if(isOnline){
            var lat, long;
            lat = localStorage.getItem("currentLat");
            long = localStorage.getItem("currentLong");
            $scope.mapHeight = window.innerHeight-44;
            $scope.serviceName = mainService.currentServiceName;
            $scope.whoiswhere = [];
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $scope.basel = { lat: 12.973132, lon: 77.750544 };
            //12.973132, 77.750544
            $scope.zoom = 6;
            //alert(lat + ' '+ long);
            $scope.center ={latitude: lat, longitude: long};
            $scope.current ={lat: lat, lon: long};
            $scope.whoiswhere = [
                {
                    "name": "Second Marker",
                    "lat": $scope.basel.lat,
                    "lon": $scope.basel.lon,
                    "mobile":"9876543210" ,
                    "photo":'img/marker.png',
                    "license":'23123 2312 123',
                    "address":"#12 orpad cross Bangalore, India"
                },
                {
                    "name": "Current Position",
                    "lat": $scope.current.lat,
                    "lon": $scope.current.lon,
                    "mobile":"9876543210" ,
                    "photo":'img/marker.png',
                    "license":'23123 2312 123',
                    "address":"#12 orpad cross Bangalore, India"
                }
            ];







        }else{
            $state.go('error');
        }
        // check login code
       /* $ionicPlatform.ready(function() {	navigator.geolocation.getCurrentPosition(function(position) {
         $scope.position=position;
         var c = position.coords;
         $scope.gotoLocation(c.latitude, c.longitude);
         $scope.$apply();
         },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
         $scope.gotoLocation = function (lat, lon) {
         if ($scope.lat != lat || $scope.lon != lon) {
         $scope.basel = { lat: lat, lon: lon };
         if (!$scope.$$phase) $scope.$apply("basel");
         }
         };

         // some points of interest to show on the map
         // to be user as markers, objects should have "lat", "lon", and "name" properties
         $scope.whoiswhere = [
         { "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon }
         ];

         });*/
    })
    .filter('lat', function () {
        return function (input, decimals) {
            if (!decimals) decimals = 0;
            input = input * 1;
            var ns = input > 0 ? "N" : "S";
            input = Math.abs(input);
            var deg = Math.floor(input);
            var min = Math.floor((input - deg) * 60);
            var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
            return deg + "°" + min + "'" + sec + '"' + ns;
        }
    })
    .filter('lon', function () {
        return function (input, decimals) {
            if (!decimals) decimals = 0;
            input = input * 1;
            var ew = input > 0 ? "E" : "W";
            input = Math.abs(input);
            var deg = Math.floor(input);
            var min = Math.floor((input - deg) * 60);
            var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
            return deg + "°" + min + "'" + sec + '"' + ew;
        }
    });
