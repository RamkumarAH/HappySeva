'use strict';

angular.module('happysevaApp.services',[])
    .service('auth', function (API_URL, $http, authToken, $state, $window, $q) {
        function authSuccessful(res) {
            authToken.setToken(res.token);
            $state.go('main');
        }
        this.login = function (email, password) {
            return $http.post(API_URL + 'login', {
                email: email,
                password: password
            }).success(authSuccessful);
        };
        this.register = function (email, password) {
            return $http.post(API_URL + 'register', {
                email: email,
                password: password
            }).success(authSuccessful);
        };

    })
    .service('mainService', function (API_URL, $state){
        var ServiceList= '[{"Category": "Home","Services": ["Cleaning","Nanny","Plumber","Gardening","Electrician","Carpenter","Mason","Repairs","Cooks","Maid","Furnishing","Tailoring","Driver","Laundry & Ironing","Painting","Pest Control"]},{"Category": "Office","Services": ["Office Supplies","Office Maintenance","Office Accounting","Office Secretarial","Courier - Last Mile","Office Furnishing"]},{"Category": "Security","Services": ["Child Security (school group)","Women Security (office group)","Home Security","Guard Services","Office Security","Firedorm","Online Security (specailized)"]},{"Category": "Citizen","Services": ["Bangalore One","Companion Services","E-Governance","Saloon Services","e-facilitation"]},{"Category": "Medical","Services": ["Ambulance","Diagnostics","Clinical Services","Pharma/Chemists","Ayurveda"]},{"Category": "Recreation","Services": ["Sports","Library","Gym","Yoga","Arts","Events","Kids"]}]';
        var ServiceList1 = '[{"Category": "Home","Services": [{"name":"Cleaning","status":"yes"},{"name":"Nanny","status":"yes"},{"name":"Furnishing","status":"yes"},{"name":"Pest Control","status":"yes"},{"name":"Plumber","status":"no"},{"name":"Gardenning","status":"no"},{"name":"Electrician","status":"no"},{"name":"Carpenter","status":"no"},{"name":"Mason","status":"no"},{"name":"Repairs","status":"no"},{"name":"Cooks","status":"no"},{"name":"Maid","status":"no"},{"name":"Tailoring","status":"no"},{"name":"Driver","status":"no"},{"name":"Laundry & Ironing","status":"no"},{"name":"Painting","status":"no"}]},{"Category": "Office","Services": [{"name":"Office Accounting","status":"yes"},{"name":"Office Secretarial","status":"yes"},{"name":"Office Furnishing","status":"yes"},{"name":"Office Supplies","status":"no"},{"name":"Office Maintenance","status":"no"},{"name":"Courier - Last Mile","status":"no"}]},{"Category": "Security","Services": [{"name":"Child Security (school group)","status":"no"},{"name":"Women Security (office group)","status":"no"},{"name":"Home Security","status":"no"},{"name":"Guard Services","status":"no"},{"name":"Office Security","status":"no"},{"name":"Firedorm","status":"no"},{"name":"Online Security (specailized)","status":"no"}]},{"Category": "Citizen","Services": [{"name":"Bangalore One","status":"no"},{"name":"Companion Services","status":"no"},{"name":"E-Governance","status":"no"},{"name":"Saloon Services","status":"no"},{"name":"e-facilitation","status":"no"}]},{"Category": "Medical","Services": [{"name":"Diagnostics","status":"yes"},{"name":"Clinical Services","status":"yes"},{"name":"Pharma/Chemists","status":"yes"},{"name":"Ayurveda","status":"no"},{"name":"Ambulance","status":"no"}]},{"Category": "Recreation","Services": [{"name":"Sports","status":"yes"},{"name":"Gym","status":"yes"},{"name":"Yoga","status":"yes"},{"name":"Kids","status":"yes"},{"name":"Events","status":"no"},{"name":"Arts","status":"no"},{"name":"Library","status":"no"}]}]';
        function ListSuccessful(res) {


        }

        this.category ='';
        this.currentServiceName ='';
        this.setCategory = function(cat){
            localStorage.setItem("currentCategory", cat);
            this.category = localStorage.getItem("currentCategory");

        }
        this.setServiceName = function(name){
            localStorage.setItem("currentServiceName", name);
            this.currentServiceName = localStorage.getItem("currentServiceName");

        }
        this.subServices = function (category){
            /*return $http.post(API_URL+'subservices',{
                category:category
            }).success(ListSuccessful);*/
            var DataList =JSON.parse(ServiceList1)
           // console.log(DataList);
           // console.log(category);
            for(var i=0;i<DataList.length;i++){
                if(DataList[i].Category == category){
                 //  console.log(DataList[i].Services);
                   return DataList[i].Services;
                }
            }

        }
    })
    .service('CordovaNetwork', ['$ionicPlatform', '$q', function($ionicPlatform, $q) {
        // Get Cordova's global Connection object or emulate a smilar one
        var Connection = window.Connection || {
            "CELL"     : "cellular",
            "CELL_2G"  : "2g",
            "CELL_3G"  : "3g",
            "CELL_4G"  : "4g",
            "ETHERNET" : "ethernet",
            "NONE"     : "none",
            "UNKNOWN"  : "unknown",
            "WIFI"     : "wifi"
        };

        var asyncGetConnection = function () {
            var q = $q.defer();
            $ionicPlatform.ready(function () {
                if(navigator.connection) {
                    q.resolve(navigator.connection);
                } else {
                    q.reject('navigator.connection is not defined');
                }
            });
            return q.promise;
        };

        return {
            isOnline: function () {
                return asyncGetConnection().then(function(networkConnection) {
                    var isConnected = false;

                    switch (networkConnection.type) {
                        case Connection.ETHERNET:
                        case Connection.WIFI:
                        case Connection.CELL_2G:
                        case Connection.CELL_3G:
                        case Connection.CELL_4G:
                        case Connection.CELL:
                            isConnected = true;
                            break;
                    }
                    return isConnected;
                });
            }
        };
    }])
    .service('Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();
                console.log('server');
                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }

        }
    }])
    .factory('$cordovaSplashscreen', [function () {

        return {
            hide: function () {
                return navigator.splashscreen.hide();
            },

            show: function () {
                return navigator.splashscreen.show();
            }
        };

    }]);