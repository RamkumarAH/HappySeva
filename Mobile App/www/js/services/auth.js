'use strict';

angular.module('happysevaApp.services',[])
    .service('auth', function (API_URL, $http, $state, $window, $q) {
        function authSuccessful(res) {
            return res;
        }
        this.login = function (email, password) {
            alert(email+' '+ password);
            var data='email='+email +'&password='+password;
            return $http.post('http://www.webenza.in/happy-seva/services/login/'+data).success(authSuccessful);
        };
        this.register = function (name ,email, password) {
            var data='email='+email +'&password='+password+'&name='+name;
            return $http.post(API_URL + '/registration/'+data,
            {
                headers: { 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS', 'Content-Type': 'application/json; charset=utf-8', dataType: "json" }
            }).success(authSuccessful);
        };

    })
    .service('mainService', function (API_URL, $state){
        var ServiceList= '[{"Category": "House","Services": ["Cleaning","Nanny","Plumber","Gardening","Electrician","Carpenter","Mason","Repairs","Cooks","Maid","Furnishing","Tailoring","Driver","Laundry & Ironing","Painting","Pest Control"]},{"Category": "Office","Services": ["Office Supplies","Office Maintenance","Office Accounting","Office Secretarial","Courier - Last Mile","Office Furnishing"]},{"Category": "Security","Services": ["Child Security (school group)","Women Security (office group)","Home Security","Guard Services","Office Security","Firedorm","Online Security (specailized)"]},{"Category": "Citizen","Services": ["Bangalore One","Companion Services","E-Governance","Saloon Services","e-facilitation"]},{"Category": "Medical","Services": ["Ambulance","Diagnostics","Clinical Services","Pharma/Chemists","Ayurveda"]},{"Category": "Recreation","Services": ["Sports","Library","Gym","Yoga","Arts","Events","Kids"]}]';
        var ServiceList1 = '[{"Category": "House","Services": [{"name":"Cleaning","status":"yes"},{"name":"Nanny","status":"yes"},{"name":"Furnishing","status":"yes"},{"name":"Pest Control","status":"yes"},{"name":"Plumber","status":"no"},{"name":"Gardenning","status":"no"},{"name":"Electrician","status":"no"},{"name":"Carpenter","status":"no"},{"name":"Mason","status":"no"},{"name":"Repairs","status":"no"},{"name":"Cooks","status":"no"},{"name":"Maid","status":"no"},{"name":"Tailoring","status":"no"},{"name":"Driver","status":"no"},{"name":"Laundry & Ironing","status":"no"},{"name":"Painting","status":"no"}]},{"Category": "Office","Services": [{"name":"Office Accounting","status":"yes"},{"name":"Office Secretarial","status":"yes"},{"name":"Office Furnishing","status":"yes"},{"name":"Office Supplies","status":"no"},{"name":"Office Maintenance","status":"no"},{"name":"Courier - Last Mile","status":"no"}]},{"Category": "Security","Services": [{"name":"Child Security (school group)","status":"no"},{"name":"Women Security (office group)","status":"no"},{"name":"Home Security","status":"no"},{"name":"Guard Services","status":"no"},{"name":"Office Security","status":"no"},{"name":"Firedorm","status":"no"},{"name":"Online Security (specailized)","status":"no"}]},{"Category": "Citizen","Services": [{"name":"Bangalore One","status":"no"},{"name":"Companion Services","status":"no"},{"name":"E-Governance","status":"no"},{"name":"Saloon Services","status":"no"},{"name":"e-facilitation","status":"no"}]},{"Category": "Medical","Services": [{"name":"Diagnostics","status":"yes"},{"name":"Clinical Services","status":"yes"},{"name":"Pharma/Chemists","status":"yes"},{"name":"Ayurveda","status":"no"},{"name":"Ambulance","status":"no"}]},{"Category": "Recreation","Services": [{"name":"Sports","status":"yes"},{"name":"Gym","status":"yes"},{"name":"Yoga","status":"yes"},{"name":"Kids","status":"yes"},{"name":"Events","status":"no"},{"name":"Arts","status":"no"},{"name":"Library","status":"no"}]}]';
        var OrderList = '[{"OrderList":[{"orderId":"#Hs123456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","stutas":"active"},{"orderId":"#Hs230456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai xyz service","stutas":"active"},{"orderId":"#Hs128456","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","stutas":"active"},{"orderId":"#Hs123486","orderDate":"March 05, 2015 | 11.00 AM", "vender":"Om sai pluming service","stutas":"completed"}]}]';

        function ListSuccessful(res) {


        }

        this.category ='';
        this.currentServiceName ='';
        this.setCategory = function(cat){
            localStorage.setItem("currentCategory", cat);
            this.category = localStorage.getItem("currentCategory");

        },
        this.setServiceName = function(name){
            localStorage.setItem("currentServiceName", name);
            this.currentServiceName = localStorage.getItem("currentServiceName");

        },
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

        },
        this.getOrderList = function(){
            /*return $http.post(API_URL+'subservices',{
             category:category
             }).success(ListSuccessful);*/
            var OrderList1 =JSON.parse(OrderList);
            for(var i=0;i<OrderList1.length;i++){

                    return OrderList1[i].OrderList;

            }
           /* console.log(OrderList);
            return OrderList1*/

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

    }])
    .factory('$cordovaNetwork', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var offlineEvent = function () {
            var networkState = navigator.connection.type;
            $timeout(function () {
                $rootScope.$broadcast('$cordovaNetwork:offline', networkState);
            });
        };

        var onlineEvent = function () {
            var networkState = navigator.connection.type;
            $timeout(function () {
                $rootScope.$broadcast('$cordovaNetwork:online', networkState);
            });
        };

        document.addEventListener("deviceready", function () {
            if (navigator.connection) {
                document.addEventListener("offline", offlineEvent, false);
                document.addEventListener("online", onlineEvent, false);
            }
        });

        return {
            getNetwork: function () {
                return navigator.connection.type;
            },

            isOnline: function () {
                var networkState = navigator.connection.type;
                return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
            },

            isOffline: function () {
                var networkState = navigator.connection.type;
                return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
            },

            clearOfflineWatch: function () {
                document.removeEventListener("offline", offlineEvent);
                $rootScope.$$listeners["$cordovaNetwork:offline"] = [];
            },

            clearOnlineWatch: function () {
                document.removeEventListener("online", offlineEvent);
                $rootScope.$$listeners["$cordovaNetwork:online"] = [];
            }
        };
    }])
    .factory('$cordovaGeolocation', ['$q', function ($q) {

        return {
            getCurrentPosition: function (options) {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            watchPosition: function (options) {
                var q = $q.defer();

                var watchID = navigator.geolocation.watchPosition(function (result) {
                    q.notify(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                q.promise.cancel = function () {
                    navigator.geolocation.clearWatch(watchID);
                };

                q.promise.clearWatch = function (id) {
                    navigator.geolocation.clearWatch(id || watchID);
                };

                q.promise.watchID = watchID;

                return q.promise;
            },

            clearWatch: function (watchID) {
                return navigator.geolocation.clearWatch(watchID);
            }
        };
    }]);