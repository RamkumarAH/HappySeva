'use strict';
var PHONE_REGEXP = '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/';
angular.module('happysevaApp')
    .directive('validateEquals', function() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, model) {
                if (!attrs.validateEquals) {
                    console.error('validateEquals expects a model as an argument!');
                    return;
                }
                scope.$watch(attrs.validateEquals, function (value) {
                    model.$setValidity('validateEquals', value === model.$viewValue);
                });
                model.$parsers.push(function (value) {
                    var isValid = value === scope.$eval(attrs.validateEquals);
                    model.$setValidity('validateEquals', isValid);
                    return isValid ? value : undefined;
                });
            }
        };
    })
    .directive('phone', function(){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function() {
                    var value = this.value;
                    if(PHONE_REGEXP.test(value)) {
                        // Valid input
                        console.log("valid phone number");
                        angular.element(this).parent().next().css('display','none');
                    } else {
                        // Invalid input
                        console.log("invalid phone number");
                        angular.element(this).parent().next().css('display','block');

                    }
                });
            }
        }
    })
    .directive('myMap', function() {
        // directive link function
        var link = function(scope, element, attrs) {
            var map, infoWindow;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(50, 2),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            // init the map
            function initMap() {
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(map, position, title, content) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: 'img/marker.png'
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            // show the map and place some markers
            initMap();

            setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
            setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
            setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
        };

        return {
            restrict: 'A',
            template: '<div id="gmaps"></div>',
            replace: true,
            link: link
        };
    })
     .directive("appMap", function ($window) {
        return {
            restrict: "E",
            replace: true,
            template: "<div></div>",
            scope: {
                center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@",         // Map width in pixels.
                height: "@",        // Map height in pixels.
                zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
                panControl: "@",    // Whether to show a pan control on the map.
                zoomControl: "@",   // Whether to show a zoom control on the map.
                scaleControl: "@"   // Whether to show scale control on the map.
            },
            link: function (scope, element, attrs) {
                var toResize, toCenter;
                var map;
                var infowindow;
                var currentMarkers;
                var callbackName = 'InitMapCb';

                // callback when google maps is loaded
                $window[callbackName] = function() {
                    console.log("map: init callback");
                    createMap();
                    updateMarkers();
                };

                if (!$window.google || !$window.google.maps ) {
                    console.log("map: not available - load now gmap js");
                    loadGMaps();
                }
                else
                {
                    console.log("map: IS available - create only map now");
                    createMap();
                }
                function loadGMaps() {
                    console.log("map: start loading js gmaps");
                    var script = $window.document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
                    $window.document.body.appendChild(script);
                }

                function createMap() {
                    console.log("map: create map start");
                    var mapOptions = {
                        zoom: 10,
                        center: new google.maps.LatLng(12.9667, 77.5667),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        panControl: true,
                        zoomControl: true,
                        mapTypeControl: true,
                        scaleControl: false,
                        streetViewControl: false,
                        navigationControl: true,
                        disableDefaultUI: true,
                        overviewMapControl: true
                    };
                    if (!(map instanceof google.maps.Map)) {
                        console.log("map: create map now as not already available ");
                        map = new google.maps.Map(element[0], mapOptions);
                        // EDIT Added this and it works on android now
                        // Stop the side bar from dragging when mousedown/tapdown on the map
                        google.maps.event.addDomListener(element[0], 'mousedown', function(e) {
                            e.preventDefault();
                            return false;
                        });
                        infowindow = new google.maps.InfoWindow();

                    }
                }

                scope.$watch('markers', function() {
                    updateMarkers();
                });

                // Info window trigger function
                function onItemClick(pin, label, datum, url) {
                    // Create content
                    var contentString= "<div id='infoBgwindow'>"
                    contentString += "Name: " + label + "<br />Mobile: " + datum;
                    contentString += '</div>';
                    console.log(contentString);

                    google.maps.event.addListener(infowindow, 'domready', function() {
                        console.log("map: hi  ");
                       var myParent = document.getElementById("infoBgwindow").parentNode.parentNode.parentNode.parentNode;
                        myParent.className = 'mainInfoWindow';
                       var myChild = document.getElementById("infoBgwindow").parentNode.parentNode.parentNode.parentNode;
                        myChild.childNodes.item(0).childNodes.item(3).className ='mainInfoWindow';
                        myChild.childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).className ='mainInfoWindow';
                        myChild.childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).className ='mainInfoWindow';
                    });
                    // Replace our Info Window's content and position
                    infowindow.setContent(contentString);
                    infowindow.setPosition(pin.position);
                    infowindow.open(map)



                    google.maps.event.addListener(infowindow, 'closeclick', function() {
                        //console.log("map: info windows close listener triggered ");
                        infowindow.close();
                    });


                }

                function markerCb(marker, member, location) {
                    return function() {
                        console.log("map: marker listener for " + member.name + member.mobile);
                        var href="http://maps.apple.com/?q="+member.lat+","+member.lon;
                        map.setCenter(location);
                        onItemClick(marker, member.name, member.mobile, href);
                    };
                }

                // update map markers to match scope marker collection
                function updateMarkers() {
                    if (map && scope.markers) {
                        // create new markers
                        //console.log("map: make markers ");
                        currentMarkers = [];
                        var markers = scope.markers;
                        if (angular.isString(markers)) markers = scope.$eval(scope.markers);
                        for (var i = 0; i < markers.length; i++) {

                            var m = markers[i];
                            var loc = new google.maps.LatLng(m.lat, m.lon);
                            var mm = new google.maps.Marker({ position: loc, map: map, title: m.name,icon: 'img/marker.png' });
                            //console.log("map: make marker for " + m.name);
                            google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
                            currentMarkers.push(mm);
                        }
                    }
                }

                // convert current location to Google maps location
                function getLocation(loc) {
                    if (loc == null) return new google.maps.LatLng(40, -73);
                    if (angular.isString(loc)) loc = scope.$eval(loc);
                    return new google.maps.LatLng(loc.lat, loc.lon);
                }

            } // end of link:
        }; // end of return
    })
    .directive('googlePlaces', function () {
        return {
            restrict: 'E',
            replace: true,
            // transclude:true,
            scope: { location: '=' ,placeholder:'='},
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level" placeholder="" />',
            link: function ($scope, elm, attrs) {
                var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                    var place = autocomplete.getPlace();
                    $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                    $scope.$apply();
                });
            }
        };
    })
    .directive('input', ['$parse', function ($parse) {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                if(attrs.value) {
                    $parse(attrs.ngModel).assign(scope, attrs.value);
                }
            }
        };
    }]);

