angular.module('happysevaApp.homeControllers', [])
    .controller('MainCtrl', function ($scope, $state, $ionicSideMenuDelegate) {})
    .controller('ResetPasswordCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, $ionicLoading, $cordovaToast, authToken, $cordovaNetwork) {
        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline) {

            $scope.profile = {
                oldpassword: '',
                password: ''
            };
            $scope.updatePassword = function () {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var token = authToken.getToken();


                mainService.setPassword(token, $scope.profile.oldpassword, $scope.profile.password).success(function (res) {
                    if (res.status == 1) {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');
                    }
                });
            }
        } else {
            $state.go('error');
        }
    })
    .controller('HomeCtrl', function ($scope, $state, $cordovaNetwork, $ionicSideMenuDelegate, mainService, $cordovaGeolocation, $timeout, $rootScope, $ionicLoading, $cordovaToast,authToken) {
        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline) {
            var token = authToken.getToken();
            if(token!=null){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.homeoptionList = {
                home_option_id: '',
                home_option_path: '',
                home_option_path2: '',
                home_option_title: ''
            };
            $timeout(function () {
                mainService.homeOptions().success(function (res) {
                    if (res.status) {
                        $ionicLoading.hide();
                        $scope.homeoptionList = res.data;
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');

                    }
                });

            }, 2000);
            $scope.home_height = window.innerHeight;
            $scope.home_width = window.innerWidth;
            $scope.home_top = $scope.home_height / 3;
            var temp = ($scope.home_height / 4);
            $scope.home_left = (temp / 2) - 3;
            $scope.subService = function (id, category, homeIcon) {
                $scope.setPosition();
                mainService.setCategory(category, id, homeIcon);
                $state.go('menu.servicelist');
            };
            $scope.pagerClick = function (index) {
                //alert(index);
            };
            $scope.setPosition = function () {
                var posOptions = {
                    timeout: 10000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        // alert(lat + ' '+ long);
                        localStorage.setItem("currentLat", lat);
                        localStorage.setItem("currentLong", long);
                    }, function (err) {
                        // error
                    });
            };
            }else{
                $state.go('login');
            }
        } else {
            $state.go('error');
        }


    })
    //ServiceListCtrl
    .controller('ServiceListCtrl', function ($scope, $state, $cordovaNetwork, mainService, $ionicPopup, $ionicLoading, $timeout, $cordovaToast, authToken) {
        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline) {
            var token = authToken.getToken();
            if(token!=null){
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.subserviceList = {
                service_category_id: '',
                service_category_path: '',
                service_category_path2: '',
                service_category_title: '',
                status_ind: ''
            };
            $timeout(function () {
                mainService.gethomeOptionsID(mainService.categoryId).success(function (res) {
                    if (res.status) {
                        $ionicLoading.hide();
                        $scope.subserviceList = res.data;
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');
                    }
                });
                console.log($scope.subserviceList);
            }, 2000);
            $scope.service = {
                category: '',
                list: '',
                icon: ''
            }
            $scope.showAlert = function (name) {
                var alertPopup = $ionicPopup.alert({
                    title: name + ' Service',
                    template: 'This service will begin shortly'
                });
                alertPopup.then(function (res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            };
            $scope.service.category = mainService.category;
            $scope.service.icon = mainService.categoryIcon;

            $scope.gotoService = function (name, status, id, icon, iconsamll) {
                if (status) {
                    mainService.setServiceName(name, id, icon, iconsamll);
                    $state.go('menu.appointment');

                } else {
                    $scope.showAlert(name);
                }

            }}else{
                $state.go('login');
            }

        } else {
            $state.go('error');
        }
    })
    //OrderCtrl
    .controller('OrderCtrl', function ($scope, $state, $cordovaNetwork, $ionicSideMenuDelegate, mainService, $ionicLoading, $timeout, HardwareBackButtonManager, $ionicPopover, authToken) {
        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline) {
            var token = authToken.getToken();
            if(token!=null){
            HardwareBackButtonManager.disable();

            $scope.orderlist = [{
                service_request_id: '',
                assigned_vendor: '',
                status_ind: '',
                service_category_title: '',
                created_date: ''
            }];
            //$scope.selectedorderlist= [{service_request_id:'', assigned_vendor:'', status_ind:'', service_category_title:'',created_date:''}];
            $scope.selectedorderlist = [];
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.prop = {
                "type": "select",
                "name": "Service",
                "value": "All",
                "values": ["All", "Pending", "Assigned", "Completed"]
            };
            $scope.filter2 = function (p) {

                if ($scope.prop.value === 'All') {

                    return p;
                } else if ($scope.prop.value === p.status_ind) {

                    return p;
                }
            };


            $timeout(function () {
                var token = authToken.getToken();
                mainService.getOrderList(token).success(function (res) {
                    if (res.status == 1) {
                        $ionicLoading.hide();
                        $scope.orderlist = res.data;
                        $scope.selectedorderlist = res.data;
                    } else {
                        alert(msg);
                    }
                });
            }, 2000);
            }else{
                $state.go('login');
            }
        } else {
            $state.go('error');
        }
    })
    //ProfileCtrl
    .controller('ProfileCtrl', function ($scope, $state, $cordovaNetwork, $ionicSideMenuDelegate, mainService, authToken, $ionicLoading, $cordovaCamera, $ionicModal, $cordovaToast) {
        var isOnline = $cordovaNetwork.isOnline();
        if (isOnline) {
            var token = authToken.getToken();
            if(token!=null){
           // var token = '';
            $scope.profilePhoto = '';
            $scope.is_base64 = 0;
            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
               // token = '';
                $scope.currentImage = '';
                $scope.profileClear();
                $scope.profilePhoto = '';
                $scope.is_base64 = 0;
                $scope.profile = {
                    name: '',
                    email: '',
                    mobile: '',
                    address: '',
                    photo: ''
                };
                $scope.getProfiledata();
            });
            //alert(' = '+$scope.profilePhoto);
            $scope.profileClear = function () {
                profile.name.value = '';
                profile.email.value = '';
                profile.mobile.value = '';
                profile.address.value = '';
                $scope.profilePhoto = '';

            };

            $scope.getProfiledata = function () {
               var token = authToken.getToken();
                mainService.getProfileInfo(token).success(function (res) {
                    if (res.status) {
                        $scope.profile = res.data;

                        profile.name.value = $scope.profile.name;
                        profile.email.value = $scope.profile.email;
                        profile.mobile.value = $scope.profile.mobile;
                        profile.address.value = $scope.profile.address;
                        $scope.currentImage = $scope.profile.photo;
                        $scope.profilePhoto = $scope.currentImage;
                        $scope.is_base64 = 0;

                        $ionicLoading.hide();
                    } else {
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
                var token = authToken.getToken();
                mainService.setProfileInfo(token, profile.name.value, profile.email.value, profile.mobile.value, profile.address.value, $scope.currentImage, $scope.is_base64).success(function (res) {
                    if (res.status) {
                        $scope.profile = res.data;
                        $ionicLoading.hide();
                        $cordovaToast.show('Updated successfully', 'long', 'bottom');
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.show(res.msg, 'long', 'bottom');

                    }
                })
            };

            $scope.getPhoto = function () {
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
                    $scope.is_base64 = 1;
                    //  alert($scope.currentImage);
                    $scope.closeModal();
                }, function (err) {
                    // error
                }, false);
            };
            $scope.browserPhoto = function () {
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
                    $scope.is_base64 = 1;
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
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
            }else{
                $state.go('login');
            }
        } else {
            $state.go('error');
        }
    })
    //ErrorCtrl
    .controller('ErrorCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService) {
        $scope.contentH = window.innerHeight - 44;


    })
    //ThankyouDetailsCtrl
    .controller('ThankyouDetailsCtrl', function ($scope, $stateParams, $state, $ionicSideMenuDelegate, mainService, $ionicLoading,authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.contentH = window.innerHeight - 44;
        $scope.serviceName = mainService.currentServiceName;

        $scope.smallIcon = mainService.currentServiceIconSmall;
        $scope.ServiceData = mainService.getServiceData();
        $scope.ServiceData.vendor_id = parseInt($stateParams.vendorId);
        mainService.SendRequest($scope.ServiceData).success(function (res) {
            if (res.status) {
                $ionicLoading.hide();
                $scope.OrderID = res.service_request_id;
            } else {
                $cordovaToast.show(res.msg, 'long', 'bottom');
            }

        })
        //alert($stateParams.vendorId);
        }else{
            $state.go('login');
        }
    })
    //ThankyouCtrl
    .controller('ThankyouCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, authToken) {
        var token = authToken.getToken();
        if(token!=null){
            $scope.contentH = window.innerHeight - 44;
            $scope.serviceName = mainService.currentServiceName;
            $scope.OrderID = mainService.currentOrderID;
            $scope.smallIcon = mainService.currentServiceIconSmall;
        }else{
            $state.go('login');
        }

    })
    .controller('MenuCtrl', function ($scope, $state) {

    })
    //FaqCtrl
    .controller('FaqCtrl', function ($scope, $state, mainService, $ionicLoading, $timeout, authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title = 'FAQs';
        $scope.listFAQ = [{
            faq_answer: '',
            faq_question: ''
        }];
        $ionicLoading.hide();
        $scope.getContent = function () {
            mainService.getFaqData().success(function (res) {
                $scope.listFAQ = res.data;


            })
        };
        $scope.getContent();
        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        }else{
            $state.go('login');
        }
    })
    .controller('SupportCtrl', function ($scope, $state, mainService, $ionicLoading, $timeout, authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title = 'Support';
        $scope.content = '';
        $scope.getContent = function () {
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
        }else{
            $state.go('login');
        }
    })
    .controller('PrivacyCtrl', function ($scope, $state, mainService, $ionicLoading, $timeout, authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.title = '';
        $scope.content = '';
        $scope.getContent = function () {
            mainService.getPrivacyData().success(function (res) {
                if (res.status) {
                    $scope.title = res.data.page_title;
                    $scope.content = res.data.page_short_description;
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert('Error ' + res.msg + '!');
                }
            })
        };
        $scope.getContent();
        }else{
            $state.go('login');
        }
    })
    .controller('AboutusCtrl', function ($scope, $state, $cordovaNetwork, $rootScope, mainService, $ionicLoading, $timeout, $cordovaToast, authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $scope.title = '';
        $scope.content = '';
        $scope.SettingData = {
            APPLICATION_NAME: '',
            ADMIN_EMAIL: '',
            LOGO: '',
            NO_INTERNET: '',
            CONTACT_INFO: '',
            COPY_RIGHT: '',
            TOUR_SCREEN_1: '',
            TOUR_SCREEN_2: '',
            TOUR_SCREEN_3: '',
            TOUR_SCREEN_4: '',
            TOUR_SCREEN_5: '',
            TOUR_SCREEN_6: ''
        };
        $scope.title = 'About us';
        $scope.content = 'Welcome to Happy Seva.';
        $scope.SettingData = {
            APPLICATION_NAME: '',
            ADMIN_EMAIL: '',
            LOGO: '',
            NO_INTERNET: '',
            CONTACT_INFO: '',
            COPY_RIGHT: '',
            TOUR_SCREEN_1: '',
            TOUR_SCREEN_2: '',
            TOUR_SCREEN_3: '',
            TOUR_SCREEN_4: '',
            TOUR_SCREEN_5: '',
            TOUR_SCREEN_6: ''
        };
        $scope.SettingData.TOUR_SCREEN_1 = 'img/HappySevaApp_white-Tour2.jpg';
        $scope.SettingData.TOUR_SCREEN_2 = 'img/HappySevaApp_white-Tour3.jpg';
        $scope.SettingData.TOUR_SCREEN_3 = 'img/HappySevaApp_white-Tour4.jpg';
        $scope.SettingData.TOUR_SCREEN_4 = 'img/HappySevaApp_white-Tour5.jpg';
        $scope.SettingData.TOUR_SCREEN_5 = 'img/HappySevaApp_white-Tour6.jpg';
        $scope.SettingData.TOUR_SCREEN_6 = 'img/HappySevaApp_white-Tour7.jpg';
        $scope.contentH = window.innerHeight - 64;
        $scope.skip = 'Skip';
        $scope.slideHasChanged = function ($index) {
            if ($index == 6) {
                $scope.skip = 'Done';
            } else {
                $scope.skip = 'Skip';
            }

        }
        }else{
            $state.go('login');
        }
    })
    .controller('AppointmentCtrl', function ($scope, $state, $cordovaToast, $ionicSideMenuDelegate, mainService, $cordovaCamera, $ionicModal, authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $scope.location = '';
        $scope.ServiceData = {
            token: '',
            home_option_id: '',
            service_category_id: '',
            service_request_city: '',
            service_request_area: '',
            service_request_street: '',
            service_request_house_no: '',
            service_request_mobile: '',
            service_request_problem: '',
            service_request_photo: '',
            service_request_time: '',
            vendor_id:''
        };
        var input = (document.getElementById('service_request_area'));
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            //$scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
            localStorage.setItem("serviceLat", place.geometry.location.lat());
            localStorage.setItem("serviceLong", place.geometry.location.lng());
            $scope.ServiceData.service_request_area = place.formatted_address;
            $scope.$apply();
        });
        $scope.leftButton = "ion-gear-b";
        $scope.serviceName = mainService.currentServiceName;
        $scope.currentIcon = mainService.currentServiceIcon;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        var token = '';
        $scope.$on('$ionicView.enter', function () {
            $scope.ServiceData.token = '';
            $scope.reset();
            $scope.ServiceData.token = authToken.getToken();

        });

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mm1 = today.getMinutes();
        var ss = today.getSeconds();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        $scope.currentDate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mm1 + ':' + ss;
        $scope.ServiceData.service_request_city ='Bangalore';
        $scope.ServiceData.service_request_time = $scope.currentDate;
        $scope.ServiceData.home_option_id = mainService.categoryId;
        $scope.ServiceData.service_category_id = mainService.currentServiceId;
        $scope.ServiceData.service_request_photo = '';
        $scope.checkValidation = function () {

            if ($scope.ServiceData.service_request_area != "" && $scope.ServiceData.service_request_street != "" && $scope.ServiceData.service_request_house_no != "" && $scope.ServiceData.service_request_mobile != "" &&
                $scope.ServiceData.service_request_problem != "" && $scope.ServiceData.service_request_area != undefined && $scope.ServiceData.service_request_street != undefined && $scope.ServiceData.service_request_house_no != undefined && $scope.ServiceData.service_request_mobile != undefined &&
                $scope.ServiceData.service_request_problem != undefined && $scope.ServiceData.service_request_area != null && $scope.ServiceData.service_request_street != null && $scope.ServiceData.service_request_house_no != null && $scope.ServiceData.service_request_mobile != null &&
                $scope.ServiceData.service_request_problem != null) {
                return true;
            } else {
                return false;
            }
        };
        $scope.reset = function () {
            $scope.ServiceData = mainService.getServiceData();
            $scope.ServiceData.service_request_city ='Bangalore';
            $scope.ServiceData.service_request_time = $scope.currentDate;
            $scope.ServiceData.home_option_id = mainService.categoryId;
            $scope.ServiceData.service_category_id = mainService.currentServiceId;
            $scope.ServiceData.service_request_photo = '';


        };
        $scope.NowService = function () {
            var valid = $scope.checkValidation();
            if (valid) {
                mainService.setServiceData($scope.ServiceData);
                $state.go('menu.servicemap');
            } else {
                $cordovaToast.show('Please fill the required field (*)', 'long', 'bottom')
            }
        };

        var date = new Date();
        $scope.appointmenttime = date;
        $scope.makeAppointment = function () {
            var valid = $scope.checkValidation();
            if (valid) {
                mainService.setServiceData($scope.ServiceData);
                $state.go('menu.servicenow');
            } else {
                $cordovaToast.show('Please fill the required field (*)', 'long', 'bottom')
            }

            // alert($scope.location);

        };
        $scope.lastPhoto = null;

        $scope.getPhoto = function () {
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
                $scope.imgShow = false;
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        }


        $scope.browserPhoto = function () {

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
                $scope.imgShow = false;
                $scope.closeModal();
            }, function (err) {
                // error
            }, false);
        }
        // popup Model for camera options
        $scope.imgShow = true;
        $scope.deleteImage = function(){
            var image = document.getElementById('myImage');
            image.src = '';
            $scope.imgShow = true;
        };
        $ionicModal.fromTemplateUrl('templates/my-model.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        }else{
            $state.go('login');
        }

    })
    .controller('ServiceNowCtrl', function ($scope, $state, $ionicSideMenuDelegate, mainService, $cordovaToast, $ionicLoading,authToken) {
        var token = authToken.getToken();
        if(token!=null){
        $scope.serviceName = mainService.currentServiceName;
        $scope.currentIcon = mainService.currentServiceIcon;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        $scope.ServiceData = mainService.getServiceData();
        $scope.serviceNow = function () {
           $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.ServiceData.service_request_time = servicenow.cDate.value + ' ' + servicenow.cDatetime.value;
            $scope.ServiceData.vendor_id = '';
            mainService.SendRequest($scope.ServiceData).success(function (res) {
                if (res.status) {
                    mainService.setOrderID(res.service_request_id);
                    $ionicLoading.hide();
                    $state.go('menu.thankyou');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.show(res.msg, 'long', 'bottom');
                }
            });
        }
        }else{
            $state.go('login');
        }
    })
    .controller('ServiceMapCtrl', function ($scope, $window, $state, $ionicPlatform, $location, $ionicSideMenuDelegate, mainService, $ionicLoading, $compile, $cordovaNetwork, $rootScope, $cordovaGeolocation, authToken) {
        var isOnline = $cordovaNetwork.isOnline();
        if(isOnline){
            var token = authToken.getToken();
            if(token!=null){
        var lat, long;
        lat = localStorage.getItem("serviceLat");
        long = localStorage.getItem("serviceLong");
        var lat1, long1;
        lat1 = localStorage.getItem("currentLat");
        long1 = localStorage.getItem("currentLong");
        $scope.mapHeight = window.innerHeight - 44;

        $scope.serviceName = mainService.currentServiceName;
        $scope.smallIcon = mainService.currentServiceIconSmall;
        $scope.ServiceData = mainService.getServiceData();
        $scope.pacinput = $scope.ServiceData.service_request_area;
        $scope.whoiswhere = [];
        $scope.zoom = 10;

        $scope.center = {
            latitude: lat1,
            longitude: long1
        };
        var radius = 10;
        mainService.getListVendor(lat, long, radius).success(function (res) {
            if (res.status == 1) {
                $scope.whoiswhere = res.data;

            } else {
                alert(msg);
            }
        });
        $scope.getGeoposition = function () {
            $scope.center = {
                latitude: lat1,
                longitude: long1
            };

        };
        $scope.getLatLong = function () {
            // alert($scope.pacinput);
            var geocoder = new google.maps.Geocoder();
            var address = $scope.pacinput;
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    alert(latitude);
                } else {

                }
            });
        };
            }else{
                $state.go('login');
            }
        }else{
         $state.go('error');
         }
    });
angular.module('happysevaApp.filters', [])
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
    })
    .filter('orderFilter', [function () {
        return function (orderlist, selectedorderlist) {
            if (!angular.isUndefined(orderlist) && !angular.isUndefined(selectedorderlist) && selectedorderlist.length > 0) {
                var tempClients = [];
                angular.forEach(selectedorderlist, function (id) {
                    angular.forEach(orderlist, function (orderlist) {
                        if (angular.equals(orderlist.status_ind, id)) {
                            tempClients.push(orderlist);
                        }
                    });
                });
                return tempClients;
            } else {
                return orderlist;
            }
        };
    }]);