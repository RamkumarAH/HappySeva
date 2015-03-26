angular.module('happysevaApp.ng-cordova_services',[])
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
    .factory('$cordovaCamera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                if (!navigator.camera) {
                    q.resolve(null);
                    return q.promise;
                }

                navigator.camera.getPicture(function (imageData) {
                    q.resolve(imageData);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            cleanup: function () {
                var q = $q.defer();

                navigator.camera.cleanup(function () {
                    q.resolve();
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
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
    }])
    .service( 'HardwareBackButtonManager', function($ionicPlatform){
        this.deregister = undefined;

        this.disable = function(){
            this.deregister = $ionicPlatform.registerBackButtonAction(function(e){
                e.preventDefault();
                return false;
            }, 101);
        }

        this.enable = function(){
            if( this.deregister !== undefined ){
                this.deregister();
                this.deregister = undefined;
            }
        }
        return this;
    })
    .factory('$cordovaToast', ['$q', '$window', function ($q, $window) {

        return {
            showShortTop: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showShortTop(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            showShortCenter: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showShortCenter(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            showShortBottom: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showShortBottom(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            showLongTop: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showLongTop(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            showLongCenter: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showLongCenter(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            showLongBottom: function (message) {
                var q = $q.defer();
                $window.plugins.toast.showLongBottom(message, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },


            show: function (message, duration, position) {
                var q = $q.defer();
                $window.plugins.toast.show(message, duration, position, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            }
        };

    }]);