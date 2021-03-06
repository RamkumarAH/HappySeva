'use strict';
var PHONE_REGEXP = '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/';
angular.module('happysevaApp')
    .directive('validateEquals', function () {
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
    .directive('phone', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                    var value = this.value;
                    if (PHONE_REGEXP.test(value)) {
                        // Valid input
                        console.log("valid phone number");
                        angular.element(this).parent().next().css('display', 'none');
                    } else {
                        // Invalid input
                        console.log("invalid phone number");
                        angular.element(this).parent().next().css('display', 'block');

                    }
                });
            }
        }
    })
    .directive("appMap", function ($window) {
        return {
            restrict: "E",
            replace: true,
            template: "<div></div>",
            scope: {
                center: "=", // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                /*currentPlace: "=",  // {place : "Address"}.*/
                markers: "=", // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@", // Map width in pixels.
                height: "@", // Map height in pixels.
                zoom: "@", // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                mapTypeId: "@", // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
                panControl: "@", // Whether to show a pan control on the map.
                zoomControl: "@", // Whether to show a zoom control on the map.
                scaleControl: "@" // Whether to show scale control on the map.
            },
            link: function (scope, element, attrs) {
                var toResize, toCenter;
                var map;
                var infowindow;
                var currentMarkers;
                var callbackName = 'InitMapCb';

                // callback when google maps is loaded
                $window[callbackName] = function () {
                    console.log("map: init callback");
                    createMap();
                    updateMarkers();
                    setMapCenter();

                };

                if (!$window.google || !$window.google.maps) {
                    console.log("map: not available - load now gmap js");
                    loadGMaps();
                } else {
                    console.log("map: IS available - create only map now");
                    createMap();
                }

                function loadGMaps() {
                    console.log("map: start loading js gmaps");
                    /*var script = $window.document.createElement('script');
                     script.type = 'text/javascript';
                     script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb&libraries=places';
                     $window.document.body.appendChild(script);*/
                }

                function createMap() {
                    console.log("map: create map start =" + scope.zoom);
                    var mapOptions = {
                        zoom: parseInt(scope.zoom),
                        center: new google.maps.LatLng(12.9667, 77.5667),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        panControl: false,
                        panControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        },
                        zoomControl: true,
                        mapTypeControl: false,
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                            position: google.maps.ControlPosition.RIGHT_CENTER
                        },
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
                        google.maps.event.addDomListener(element[0], 'mousedown', function (e) {
                            e.preventDefault();
                            return false;
                        });
                        infowindow = new google.maps.InfoWindow();
                        var input = /** @type {HTMLInputElement} */ (
                            document.getElementById('pacinput'));

                        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
                        var searchBox = new google.maps.places.SearchBox(
                            /** @type {HTMLInputElement} */
                            (input));
                        google.maps.event.addListener(searchBox, 'places_changed', function () {
                            var place = searchBox.getPlace();
                            localStorage.setItem("serviceLat", place.geometry.location.lat());
                            localStorage.setItem("serviceLong", place.geometry.location.lng());

                        })

                    }
                }
                scope.$watch('center', function () {
                    setMapCenter();
                });
                scope.$watch('markers', function () {
                    updateMarkers();
                });

                // Info window trigger function
                function onItemClick(pin, id, name, mobile, photo, license, address, url) {
                    // Create content
                    var contentString = "<div id='infoBgwindow'>";
                    contentString += "<div class='leftInfo'><img src='" + photo + "'/></div>";
                    contentString += "<div class='rightinfo'><h3>Vendor Profile</h3>";
                    contentString += "<p>" + name + "</p>";
                    contentString += "<p>Mobile No: " + mobile + "<br/>";
                    contentString += "Vender Licence No: " + license + "<br/>";
                    contentString += "Address: " + address + "</p>";
                    contentString += "</div>"
                    contentString += "<div class='text-right'><a class='' href='#/menu/thankyou/" + id;
                    contentString += "'>Select</a></div>"
                    contentString += '</div>';
                    console.log(contentString);

                    google.maps.event.addListener(infowindow, 'domready', function () {
                        console.log("map: hi  ");
                        var myParent = document.getElementById("infoBgwindow").parentNode.parentNode.parentNode.parentNode;
                        myParent.className = 'mainInfoWindow';

                        var myP = document.getElementById("infoBgwindow").parentNode.parentNode;
                        myP.className = 'setwidth';
                        var myP1 = document.getElementById("infoBgwindow").parentNode.parentNode.parentNode;
                        myP1.className = 'setwidth1';
                        // myP.css.width =window.innerWidth;
                        var myChild = document.getElementById("infoBgwindow").parentNode.parentNode.parentNode.parentNode;
                        myChild.childNodes.item(0).childNodes.item(1).className = 'mainInfoWindow4';
                        myChild.childNodes.item(0).childNodes.item(3).className = 'mainInfoWindow1';
                        myChild.childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).className = 'mainInfoWindow2';
                        myChild.childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).className = 'mainInfoWindow3';
                    });
                    // Replace our Info Window's content and position
                    infowindow.setContent(contentString);
                    infowindow.setPosition(pin.position);
                    infowindow.open(map)



                    google.maps.event.addListener(infowindow, 'closeclick', function () {
                        //console.log("map: info windows close listener triggered ");
                        infowindow.close();
                    });


                }
                scope.selectVendor = function (label) {
                    alert(label);
                }

                function markerCb(marker, member, location) {
                    return function () {
                        console.log("map: marker listener for " + member.name + member.mobile);
                        var href = "http://maps.apple.com/?q=" + member.latitude + "," + member.longitude;
                        map.setCenter(location);
                        onItemClick(marker, member.vendor_id, member.name, member.mobile, member.photo, member.license, member.address, href);
                    };
                }

                function setMapCenter() {
                    if (map && scope.center) {
                        var pos = new google.maps.LatLng(scope.center.latitude,
                            scope.center.longitude);

                        var mm = new google.maps.Marker({
                            position: pos,
                            map: map,
                            title: 'main',
                            icon: 'img/geoicon.png'
                        });
                        map.setCenter(pos);
                    }
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
                            var loc = new google.maps.LatLng(m.latitude, m.longitude);
                            var mm = new google.maps.Marker({
                                position: loc,
                                map: map,
                                title: m.name,
                                icon: 'img/marker.png'
                            });
                            //console.log("map: make marker for " + m.name);
                            google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
                            currentMarkers.push(mm);
                        }
                    }
                }

                // convert current location to Google maps location
                function getLocation(loc) {
                    alert('ok');
                    if (loc == null) return new google.maps.LatLng(40, -73);
                    if (angular.isString(loc)) loc = scope.$eval(loc);
                    return new google.maps.LatLng(loc.lat, loc.lon);
                }

            } // end of link:
        }; // end of return
    });