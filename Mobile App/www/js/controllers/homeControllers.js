angular.module('happysevaApp.homeControllers',[])
    .controller('MainCtrl', function($scope, $state, $ionicSideMenuDelegate) {


    })
    .controller('HomeCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaGeolocation , $timeout, $rootScope, $ionicLoading) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.homeoptionList ={home_option_id:'',home_option_path:'',home_option_path2:'',home_option_title:''};
        $timeout(function () {
            mainService.homeOptions().success(function(res){
                if(res.status){
                    $ionicLoading.hide();
                    $scope.homeoptionList =  res.data;
                }else{
                    alert('error' + res.msg);
                }
            });
            console.log($scope.homeoptionList);
        }, 2000);
        $scope.home_height = window.innerHeight;
        $scope.home_width = window.innerWidth;
        $scope.home_top = $scope.home_height / 3;
        var temp = ($scope.home_height / 4);
        $scope.home_left =  (temp / 2)- 3;
        $scope.subService = function(id, category, homeIcon){
            $scope.setPosition();
            mainService.setCategory(category, id, homeIcon);

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
    .controller('ServiceListCtrl', function ($scope, $state, mainService, $ionicPopup, $ionicLoading, $timeout) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.subserviceList ={service_category_id:'',service_category_path:'',service_category_path2:'',service_category_title:'',status_ind:''};
        $timeout(function () {
            mainService.gethomeOptionsID(mainService.categoryId).success(function(res){
                if(res.status){
                    $ionicLoading.hide();
                    $scope.subserviceList =  res.data;
                }else{
                    alert('error' + res.msg);
                }
            });
            console.log($scope.subserviceList);
        }, 2000);
        $scope.service={
            category:'',
            list:'',
            icon:''
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
        $scope.service.icon= mainService.categoryIcon;
        // $scope.service.list = mainService.subServices($scope.service.category)
        $scope.gotoService = function (name, status, id, icon, iconsamll) {
            if(status){
                mainService.setServiceName(name, id, icon, iconsamll);
                $state.go('menu.appointment');

            }else{
                $scope.showAlert(name);
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

    .controller('AboutusCtrl', function($scope, $state, $cordovaNetwork, $rootScope, mainService, $ionicLoading, $timeout){
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
    .controller('AppointmentCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaCamera, $ionicModal){
        // $state.go($state.current, {}, {reload: true});

        $scope.leftButton = "ion-gear-b";
        $scope.serviceName = mainService.currentServiceName;
        $scope.currentIcon = mainService.currentServiceIcon;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        var lat, long;
        lat = localStorage.getItem("currentLat");
        long = localStorage.getItem("currentLong");
        $scope.area ='';
        mainService.getCurrentAddress(lat, long);
        $scope.pacinput = localStorage.getItem("currentAddress");

        var date = new Date();
        $scope.appointmenttime = date;
        $scope.makeAppointment = function(){
            console.log('app is done');
            $state.go('menu.servicenow');
        };
        $scope.lastPhoto='';

        $scope.getPhoto = function() {
            console.log('upload img');
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false

            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        }


        $scope.browserPhoto = function() {
            console.log('upload img');
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false

            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        }
        // popup Model for camera options

        $ionicModal.fromTemplateUrl('templates/my-model.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
    })
    .controller('ServiceNowCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.serviceName = mainService.currentServiceName;
        $scope.currentIcon = mainService.currentServiceIcon;
        $scope.smallIcon = mainService.currentServiceIconSmall;
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
            $scope.smallIcon = mainService.currentServiceIconSmall;
            $scope.area =localStorage.getItem("currentAddress")
            $scope.pacinput = $scope.area;
            $scope.whoiswhere = [];
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $scope.basel = { lat: 12.973132, lon: 77.750544 };
            //12.973132, 77.750544
            $scope.zoom = 10;
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

            $scope.getGeoposition = function(){
                $scope.center ={latitude: lat, longitude: long};

            }

        }else{
            $state.go('error');
        }
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
