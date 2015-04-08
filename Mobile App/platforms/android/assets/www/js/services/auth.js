'use strict';

angular.module('happysevaApp.services', [])
    .service('auth', function (API_URL, $http, $state, $window, $q, authToken) {

        function authSuccessful(res) {
            authToken.removeToken();
            authToken.setToken(res.token);
            return res;
        };
        this.login = function (email, password) {
            // alert(email+' = '+ password)
            return $http.post(API_URL + '/login/', {
                email: email,
                password: password
            }).success(authSuccessful);
        };
        this.forgotPassword = function (email) {

            return $http.post(API_URL + '/forgot-password/', {
                email: email
            }).success(authSuccessful);
        };
        this.register = function (name, email, password) {
            return $http.post(API_URL + '/registration/', {
                name: name,
                email: email,
                password: password
            }).success(authSuccessful);
        };
        this.Logout = function () {
            var token = authToken.getToken();
            return $http.post(API_URL + '/logout/', {
                token: token
            }).success(function (res) {
                //  alert('Token1 = '+token);
                authToken.removeToken();
                var token1 = authToken.getToken();

                return res;
            })
        }

    })
    .service('mainService', function (API_URL, $http, $state, $window, $q, authToken) {
        var OrderList = '[{"OrderList":[{"orderId":"#Hs123456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","status":"active"},{"orderId":"#Hs230456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai xyz service","status":"active"},{"orderId":"#Hs128456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","status":"active"},{"orderId":"#Hs123486","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","status":"completed"}]}]';

        function resultSuccessful(res) {
            return res;
        }

        function authSuccessful(res) {
            return res;
        }

        // get Home Option Main page
        this.homeOptions = function () {
            return $http.get(API_URL + '/get-home-options/').success(resultSuccessful);
        },
            // get sub option particular home option
            this.gethomeOptionsID = function (id) {
                return $http.get(API_URL + '/get-service-categories/' + id).success(resultSuccessful);
            },
            this.settingDefault = function () {
                return $http.get(API_URL).success(resultSuccessful);
            },
            //service_request_id
            this.currentOrderID = '';
        this.category = '',
            this.categoryId = '',
            this.categoryIcon = '',
            this.currentServiceName = '',
            this.currentServiceId = '',
            this.currentServiceIcon = '',
            this.currentServiceIconSmall = '',
            this.curAddress = '',
            this.getAboutData = function () {
                return $http.post(API_URL + '/get-page-content/about-us/').success(function (res) {
                    return res;
                });
            },
            this.getPrivacyData = function () {
                return $http.post(API_URL + '/get-page-content/privacy-policy/').success(function (res) {
                    return res;
                });
            },

            this.getFaqData = function () {
                return $http.post(API_URL + '/faqs/').success(function (res) {
                    if (res.status) {
                        return res.data;

                    } else {
                        alert('error');
                    }

                });
            },
            this.setCategory = function (cat, id, homeIcon) {
                localStorage.setItem("currentCategory", cat);
                localStorage.setItem("currentCategoryID", id);
                localStorage.setItem("currentCategoryIcon", homeIcon)
                this.category = localStorage.getItem("currentCategory");
                this.categoryId = localStorage.getItem("currentCategoryID");
                this.categoryIcon = localStorage.getItem("currentCategoryIcon")
            },
            this.setOrderID = function (orderID) {
                localStorage.setItem("currentOrderID", orderID);
                this.currentOrderID = localStorage.getItem("currentOrderID");
            },
            this.setServiceName = function (name, id, icon, smallicon) {
                localStorage.setItem("currentServiceName", name);
                localStorage.setItem("currentServiceID", id);
                localStorage.setItem("currentServiceIcon", icon);
                localStorage.setItem("currentServiceIconsmall", smallicon);
                this.currentServiceName = localStorage.getItem("currentServiceName");
                this.currentServiceId = localStorage.getItem("currentServiceID");
                this.currentServiceIcon = localStorage.getItem("currentServiceIcon");
                this.currentServiceIconSmall = localStorage.getItem("currentServiceIconsmall");
            },

            this.getOrderList = function (token) {

                return $http.post(API_URL + '/my-services-request/', {
                    token: token
                }).success(function (res) {
                    return res;
                });
                /*var OrderList1 =JSON.parse(OrderList);
                 for(var i=0;i<OrderList1.length;i++){
                 return OrderList1[i].OrderList;
                 }*/
            },
            this.getListVendor = function (lat, long, radius) {
                return $http.post(API_URL + '/get-vendors/', {
                    latitude: lat,
                    longitude: long,
                    radius: radius
                }).success(function (res) {
                    return res;
                });

            },

            this.getCurrentAddress = function (lat, long) {
                var geocoder = new google.maps.Geocoder();
                var latLng = new google.maps.LatLng(lat, long);
                geocoder.geocode({
                    'latLng': latLng
                }, function (results, status) {
                    console.log("After getting address");
                    console.log(results);
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log(results[1]);
                            var address = results[1].formatted_address;
                            localStorage.setItem("currentAddress", address);
                        }
                    } else {
                        //alert("Geocode was not successful for the following reason: " + status);
                    }
                })
            },

            this.serviceLaterData = {},
            this.setServiceData = function (data) {
                this.serviceLaterData = data;
            },
            this.getServiceData = function () {
                return this.serviceLaterData;
            },
            this.SendRequest = function (serviceData) {
                return $http.post(API_URL + '/services-request/', {
                    token: serviceData.token,
                    home_option_id: serviceData.home_option_id,
                    service_category_id: serviceData.service_category_id,
                    service_request_city: serviceData.service_request_city,
                    service_request_area: serviceData.service_request_area,
                    service_request_street: serviceData.service_request_street,
                    service_request_house_no: serviceData.service_request_house_no,
                    service_request_mobile: serviceData.service_request_mobile,
                    service_request_problem: serviceData.service_request_problem,
                    service_request_photo: serviceData.service_request_photo,
                    service_request_time: serviceData.service_request_time,
                    vendor_id: serviceData.vendor_id

                }).success(authSuccessful);
            },
            this.getProfileInfo = function (token) {
                return $http.post(API_URL + '/my-account/view', {
                    token: token
                }).success(function (res) {
                    return res;
                });
            },
            this.setProfileInfo = function (token, name, email, mobile, address, photo, is_base64) {
                return $http.post(API_URL + '/my-account/save', {
                    token: token,
                    name: name,
                    email: email,
                    mobile: mobile,
                    address: address,
                    photo: photo,
                    is_base64: is_base64
                }).success(authSuccessful);
            }
        this.setPassword = function (token, oldpassword, newpassword) {
            //alert(oldpassword + ' == '+ newpassword);
            return $http.post(API_URL + '/my-account/changepwd/', {
                token: token,
                old_password: oldpassword,
                password: newpassword

            }).success(authSuccessful);
        }
    });