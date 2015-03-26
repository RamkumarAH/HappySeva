angular.module('happysevaApp.homeControllers',[])
    .controller('MainCtrl', function($scope, $state, $ionicSideMenuDelegate) {
    })
    .controller('HomeCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaGeolocation , $timeout, $rootScope, $ionicLoading, $cordovaToast) {
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
                    $ionicLoading.hide();
                    $cordovaToast.show(res.msg, 'long', 'bottom');

                }
            });

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
            //alert(index);
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
    .controller('ServiceListCtrl', function ($scope, $state, mainService, $ionicPopup, $ionicLoading, $timeout, $cordovaToast) {
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
                    $ionicLoading.hide();
                    $cordovaToast.show(res.msg, 'long', 'bottom');
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
    .controller('OrderCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, $ionicLoading, $timeout, HardwareBackButtonManager){

        HardwareBackButtonManager.disable();
        $scope.orderlist= {orderDate:'', orderId:'', status:'', vender:''};
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
    .controller('ProfileCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, authToken, $ionicLoading, $cordovaCamera, $ionicModal, $cordovaToast){
        var token  ='';
        $scope.profilePhoto='';
        $scope.$on('$ionicView.enter', function(){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            token = '';
            $scope.currentImage = '';

            $scope.profileClear();
            $scope.profilePhoto='';
            $scope.profile ={
                name:'',
                email:'',
                mobile:'',
                address:'',
                photo:''
            };
            $scope.getProfiledata();
        });
        //alert(' = '+$scope.profilePhoto);
        $scope.profileClear = function () {
            profile.name.value ='';
            profile.email.value = '';
            profile.mobile.value = '';
            profile.address.value = '';
            $scope.profilePhoto='';
            /*profile.profilePhoto.src='';
            var image = document.getElementById('profilePhoto');
            image.src = '';*/
        };
        $scope.getProfiledata = function () {
            token = authToken.getToken();
            mainService.getProfileInfo(token).success(function(res){
                if(res.status){
                    $scope.profile = res.data;
                    profile.name.value =$scope.profile.name;
                    profile.email.value = $scope.profile.email;
                    profile.mobile.value = $scope.profile.mobile;
                    profile.address.value = $scope.profile.address;
                    $scope.currentImage = $scope.profile.photo;
                    $scope.profilePhoto=$scope.currentImage;
                   /*// alert($scope.currentImage);
                    var image = document.getElementById('profilePhoto');
                    image.src = '';
                    image.src = $scope.currentImage;
                    //alert(profile.profilePhoto.src);*/

                    $ionicLoading.hide();
                }else{
                    $ionicLoading.hide();
                    $cordovaToast.show(res.msg, 'long', 'bottom');
                }

            })
        };
        $scope.updateProfile = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            token = authToken.getToken();
            mainService.setProfileInfo(token,profile.name.value, profile.email.value,profile.mobile.value, profile.address.value, $scope.currentImage).success(function(res){
                if(res.status){
                    $scope.profile = res.data;
                    $ionicLoading.hide();
                    $cordovaToast.show('Updated successfully', 'long', 'bottom');
                }else{
                    $ionicLoading.hide();
                    $cordovaToast.show(res.msg, 'long', 'bottom');

                }
            })
        };

        $scope.getPhoto = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('profilePhoto');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.currentImage = imageData;
              //  alert($scope.currentImage);
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        };
        $scope.browserPhoto = function() {
            //console.log('upload img');
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false

            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('profilePhoto');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.currentImage = imageData;
               // alert($scope.currentImage);
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
    //ErrorCtrl
    .controller('ErrorCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.contentH = window.innerHeight-44;


    })
//ThankyouDetailsCtrl
    .controller('ThankyouDetailsCtrl',function($scope,$stateParams, $state, $ionicSideMenuDelegate, mainService){
        $scope.contentH = window.innerHeight-44;
        $scope.serviceName = mainService.currentServiceName;
        $scope.OrderID = mainService.currentOrderID;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        //alert($stateParams.vendorId);

    })
    //ThankyouCtrl
    .controller('ThankyouCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService){
        $scope.contentH = window.innerHeight-44;
        $scope.serviceName = mainService.currentServiceName;
        $scope.OrderID = mainService.currentOrderID;
        $scope.smallIcon = mainService.currentServiceIconSmall;

    })
    .controller('MenuCtrl', function ($scope, $state) {

    })
    //FaqCtrl
    .controller('FaqCtrl',function($scope, $state, mainService, $ionicLoading, $timeout){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title ='FAQs';
        $scope.listFAQ =[{faq_answer:'',faq_question:''}];
        $ionicLoading.hide();
        $scope.getContent = function(){
           mainService.getFaqData().success(function(res){
                $scope.listFAQ= res.data;


            })
        };
        $scope.getContent();
        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
    })
    .controller('SupportCtrl',function($scope, $state, mainService, $ionicLoading, $timeout){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title ='Support';
        $scope.content = '';
        $scope.getContent = function(){
            $ionicLoading.hide();
            $scope.content = 'coming soon';
            /*mainService.getPrivacyData().success(function(res){
                if(res.status){
                    $scope.title =res.data.page_title;
                    $scope.content = res.data.page_short_description;
                    $ionicLoading.hide();
                }
            })*/
        };
        $scope.getContent();
    })
    .controller('PrivacyCtrl',function($scope, $state, mainService, $ionicLoading, $timeout){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title ='';
        $scope.content = '';
        $scope.getContent = function(){
            mainService.getPrivacyData().success(function(res){
                if(res.status){
                    $scope.title =res.data.page_title;
                    $scope.content = res.data.page_short_description;
                    $ionicLoading.hide();
                }else{
                    $ionicLoading.hide();
                    alert('Error ' + res.msg + '!');
                }
            })
        };
        $scope.getContent();
    })
    .controller('AboutusCtrl', function($scope, $state, $cordovaNetwork, $rootScope, mainService, $ionicLoading, $timeout, $cordovaToast){
       /* $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });*/
        $scope.title ='';
        $scope.content = '';
       /* $scope.getContent = function(){
          mainService.getAboutData().success(function(res){
            if(res.status){
                $scope.title =res.data.page_title;
                $scope.content = res.data.page_short_description;
            }else{
                $ionicLoading.hide();
                alert('Error ' + res.msg + '!');
            }
          })
        };*/
        $scope.SettingData ={APPLICATION_NAME:'',ADMIN_EMAIL:'',LOGO:'',NO_INTERNET:'',CONTACT_INFO:'',COPY_RIGHT:'',TOUR_SCREEN_1:'',TOUR_SCREEN_2:'',TOUR_SCREEN_3:'',TOUR_SCREEN_4:'',TOUR_SCREEN_5:'',TOUR_SCREEN_6:''};
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
                $ionicLoading.hide();
                $cordovaToast.show(res.msg, 'long', 'bottom');
            }
        });*/
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
    .controller('AppointmentCtrl',function($scope, $state, $cordovaToast, $ionicSideMenuDelegate, mainService, $cordovaCamera, $ionicModal, authToken){
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

        $scope.ServiceData = {
            token:'',
            home_option_id:'',
            service_category_id:'',
            service_request_city:'',
            service_request_area:'',
            service_request_street:'',
            service_request_house_no:'',
            service_request_mobile:'',
            service_request_problem:'',
            service_request_photo:'',
            service_request_time:''
        };
        var token  ='';
        $scope.$on('$ionicView.enter', function(){
            $scope.ServiceData.token = '';
            $scope.ServiceData.token = authToken.getToken();
        });
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var hh =today.getHours();
        var mm1 = today.getMinutes();
        var ss = today.getSeconds();
        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }
        $scope.currentDate = yyyy+'-'+mm+'-'+dd+' '+hh+':'+mm1+':'+ss;

        $scope.ServiceData.service_request_time =$scope.currentDate;
        $scope.ServiceData.home_option_id =mainService.categoryId;
        $scope.ServiceData.service_category_id= mainService.currentServiceId;
        $scope.ServiceData.service_request_photo = '';
        $scope.NowService = function(){
            mainService.SendRequest($scope.ServiceData).success(function(res){
                if(res.status){
                    mainService.setOrderID(res.service_request_id);
                    $state.go('menu.servicemap');
                }else{
                    $cordovaToast.show(res.msg, 'long', 'bottom');
                }

            });

        };

        var date = new Date();
        $scope.appointmenttime = date;
        $scope.makeAppointment = function(){
            mainService.setServiceData($scope.ServiceData);

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
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false

            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.ServiceData.service_request_photo = imageData;
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        }


        $scope.browserPhoto = function() {

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false

            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                $scope.ServiceData.service_request_photo = imageData;
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
    .controller('ServiceNowCtrl',function($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaToast){
        $scope.serviceName = mainService.currentServiceName;
        $scope.currentIcon = mainService.currentServiceIcon;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        $scope.ServiceData = mainService.getServiceData();

        $scope.serviceNow = function (){
            $scope.ServiceData.service_request_time =servicenow.cDate.value +' '+servicenow.cDatetime.value ;
            /*alert($scope.ServiceData.service_request_time);
            alert($scope.ServiceData.token);*/
            mainService.SendRequest($scope.ServiceData).success(function(res){
                if(res.status){
                    mainService.setOrderID(res.service_request_id);
                    $state.go('menu.thankyou');
                }else{
                    $cordovaToast.show(res.msg, 'long', 'bottom');
                }

            })
            //$state.go('menu.thankyou');

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
            $scope.area =localStorage.getItem("currentAddress");
            $scope.pacinput = $scope.area;
            $scope.whoiswhere = [];
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $scope.basel = { lat: 12.973132, lon: 77.750544 };
            //12.973132, 77.750544
            $scope.zoom = 10;
            //alert(lat + ' '+ long);
            $scope.center ={latitude: lat, longitude: long};
            $scope.current ={ lat: 12.963532, lon: 77.763544 };
            $scope.whoiswhere = [
                {
                    "id":"1",
                    "name": "Second Marker",
                    "lat": $scope.basel.lat,
                    "lon": $scope.basel.lon,
                    "mobile":"9876543210" ,
                    "photo":'img/marker.png',
                    "license":'23123 2312',
                    "address":"#12 orpad cross Bangalore, India"
                },
                {
                    "id":"2",
                    "name": "Current Position",
                    "lat": $scope.current.lat,
                    "lon": $scope.current.lon,
                    "mobile":"9876543210" ,
                    "photo":'img/marker.png',
                    "license":'23123 0123',
                    "address":"#12 orpad cross Bangalore, India"
                }
            ];

            $scope.getGeoposition = function(){
                $scope.center ={latitude: lat, longitude: long};

            };


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
