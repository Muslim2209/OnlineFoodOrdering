function InfoBox(opts) {
            google.maps.OverlayView.call(this);
            this.latlng_ = opts.latlng;
            this.map_ = opts.map;
            this.content = opts.content;
            this.offsetVertical_ = -400;
            this.offsetHorizontal_ = -130;
            this.height_ = 375;
            this.width_ = 260;
            this.div_ = $('.wwone__map-infobox');
            //var me = this;
            //this.boundsChangedListener_ =  google.maps.event.addListener(this.map_, "bounds_changed", function() {
            //return me.panMap.apply(me);
            //});
            // Once the properties of this OverlayView are initialized, set its map so
            // that we can display it. This will trigger calls to panes_changed and
            // draw.
            this.setMap(this.map_);
        }
        /* InfoBox extends GOverlay class from the Google Maps API
         */
        InfoBox.prototype = new google.maps.OverlayView();
        /* Creates the DIV representing this InfoBox
         */
        InfoBox.prototype.remove = function () {
            var panes = this.getPanes();
            if (typeof panes !== 'undefined') {
                $(panes.floatPane).contents().css({
                    'display': 'none'
                });
                if (this.div_) {
                    this.div_.css({
                        'display': 'none'
                    });
                }
            }
        }
        InfoBox.prototype.show = function () {
            this.div_.css({
                'display': 'block'
            });
        };
        /* Redraw the Bar based on the current projection and zoom level
         */
        InfoBox.prototype.draw = function () {
            var timer;
            // Creates the element if it doesn't exist already.
            if (this.initialised !== true) {
                this.createElement();
            }
            if (!this.div_) {
                return;
            }
            // Calculate the DIV coordinates of two opposite corners of our bounds to
            // get the size and position of our Bar
            var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
            if (!pixPosition) {
                return;
            }
            // Set height to content and reset the offset of box
            //var newHeight = this.div_.height();
            // this.offsetVertical_ = 0 - ( this.div_.outerHeight() + 60 );
            var getHeight = $.proxy(function () {
                var tempHeight = this.div_.outerHeight();
                if (tempHeight > 0) {
                    this.offsetVertical_ = 0 - (tempHeight + 60);
                }
                this.div_.css({
                    'height': 'auto'
                    , 'left': (pixPosition.x + this.offsetHorizontal_) + 'px'
                    , 'top': (pixPosition.y + this.offsetVertical_) + 'px'
                });
            }, this);
            if (this.div_.find('.wwone__map-infobox__thumb').length > 0 && typeof this.div_.find('.wwone__map-infobox__thumb').attr('ng-src') !== 'undefined') {
                //Has image lets wait for it to load (with a timeout just in case)
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    getHeight();
                }, 1000);
                this.div_.find('.wwone__map-infobox__thumb').bind('load', $.proxy(function () {
                    $timeout.cancel(timer);
                    getHeight();
                }, this));
            }
            else {
                //No Image just get height
                getHeight();
            }
        };
        /* Creates the DIV representing this InfoBox in the floatPane. If the panes
         * object, retrieved by calling getPanes, is null, remove the element from the
         * DOM. If the div exists, but its parent is not the floatPane, move the div
         * to the new pane.
         * Called from within draw. Alternatively, this can be called specifically on
         * a panes_changed event.
         */
        InfoBox.prototype.createElement = function () {
            var panes = this.getPanes();
            // This does not handle changing panes.  You can set the map to be null and
            // then reset the map to move the div.
            this.div_ = $('<div id="wwone__map-infobox" class="wwone__map-infobox" />').css({
                'position': 'absolute'
                , 'height': 'auto'
                , 'display': 'none'
            });
            //contentDiv
            var contentDiv = $('<div id="info-box-content" />');
            // closeLink
            var closeLink = $('<a class="wwone__map-infobox__close"><span>X</span></a>');
            this.div_.append(closeLink).append(contentDiv);
            $(panes.floatPane).append(this.div_);
            google.maps.event.addDomListener(closeLink[0], 'click', $.proxy(function (evt) {
                evt.cancelBubble = true;
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                this.remove(); //could be just hide
                return false;
            }, this));
            this.initialised = true;
        };
        /* Pan the map to fit the InfoBox.
         */
        InfoBox.prototype.panMap = function () {
            // if we go beyond map, pan map
            var map = this.map_;
            var bounds = map.getBounds();
            if (!bounds) {
                return;
            }
            // The position of the infowindow
            var position = this.latlng_;
            // The dimension of the infowindow
            var iwWidth = this.width_;
            var iwHeight = this.height_;
            // The offset position of the infowindow
            var iwOffsetX = this.offsetHorizontal_;
            var iwOffsetY = this.offsetVertical_;
            // Padding on the infowindow
            var padX = 40;
            var padY = 40;
            // The degrees per pixel
            var mapDiv = map.getDiv();
            var mapWidth = mapDiv.offsetWidth;
            var mapHeight = mapDiv.offsetHeight;
            var boundsSpan = bounds.toSpan();
            var longSpan = boundsSpan.lng();
            var latSpan = boundsSpan.lat();
            var degPixelX = longSpan / mapWidth;
            var degPixelY = latSpan / mapHeight;
            // The bounds of the map
            var mapWestLng = bounds.getSouthWest().lng();
            var mapEastLng = bounds.getNorthEast().lng();
            var mapNorthLat = bounds.getNorthEast().lat();
            var mapSouthLat = bounds.getSouthWest().lat();
            // The bounds of the infowindow
            var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
            var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
            var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
            var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
            // calculate center shift
            var shiftLng = (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) + (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
            var shiftLat = (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) + (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
            // The center of the map
            var center = map.getCenter();
            // The new map center
            var centerX = center.lng() - shiftLng;
            var centerY = center.lat() - shiftLat;
            // center the map to the new shifted center
            //map.setCenter(new google.maps.LatLng(centerY, centerX));
            //Pan looks nicer??
            map.panTo(new google.maps.LatLng(centerY, centerX));
            // Remove the listener after panning is complete.
            google.maps.event.removeListener(this.boundsChangedListener_);
            this.boundsChangedListener_ = null;
        };
        InfoBox.prototype.open = function (content, marker) {
            this.latlng_ = marker.getPosition();
            this.setContent(content);
            this.draw();
            this.show();
            this.panMap();
        };
        InfoBox.prototype.setContent = function (content) {
            this.div_.find('#info-box-content').empty().append(content);
        };
        InfoBox.prototype.getContent = function () {
            return this.div_;
        };
        var infoBox;
        var openMarkerWindow = function () {
            //Build info box
            var localTemplate = '<img class="wwone__map-infobox__thumb" src="{{photo_file_url}}" /><div class="wwone__map-infobox__badge">{{rating}}</div><div class="wwone__map-infobox__inner"><div class="wwone__map-infobox__inner__location">{{photo_id}}</div><div class="wwone__map-infobox__inner__heading">{{photo_title}}</div><div class="wwone__map-infobox__inner__info"><div class="wwone__map-infobox__inner__info__type"><strong>Type:</strong>{{type}}</div><div class="wwone__map-infobox__inner__info__location"><strong>Working:</strong> {{open-close}}</div><div class="wwone__map-infobox__inner__info__date"><strong>Delivery:</strong> {{delivery}}</div></div><a class="wwone__map-infobox__inner__btn btn" href="{{owner_url}}" target="_blank">Find out more</a></div>';
            console.log(this);
            for (var itm in this.data) {
                console.log(itm);
                localTemplate = localTemplate.replace('{{' + itm + '}}', this.data[itm]);
            }
            //OPen
            infoBox.open(localTemplate, this);
            infoWindowShown = true;
        };

        function initialize() {
            var bounds = new google.maps.LatLngBounds();
            var center = new google.maps.LatLng(48.90759, 2.56209);
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8
                , center: center
                , mapTypeControl: true
                , mapTypeId: google.maps.MapTypeId.ROADMAP
                , streetViewControl: false
                , styles: [{
                    "featureType": "administrative"
                    , "elementType": "labels.text.fill"
                    , "stylers": [{
                        "color": "#444444"
                }]
            }, {
                    "featureType": "landscape"
                    , "elementType": "all"
                    , "stylers": [{
                        "color": "#f7f4ee"
                }]
            }, {
                    "featureType": "poi"
                    , "elementType": "all"
                    , "stylers": [{
                        "visibility": "off"
                }]
            }, {
                    "featureType": "road"
                    , "elementType": "all"
                    , "stylers": [{
                        "saturation": -50
                }, {
                        "lightness": 25
                }]
            }, {
                    "featureType": "road"
                    , "elementType": "labels.text"
                    , "stylers": [{
                        "weight": "0.52"
                }, {
                        "color": "#262323"
                }, {
                        "visibility": "on"
                }, {
                        "gamma": "4.53"
                }]
            }, {
                    "featureType": "road"
                    , "elementType": "labels.text.fill"
                    , "stylers": [{
                        "saturation": "99"
                }]
            }, {
                    "featureType": "road.highway"
                    , "elementType": "all"
                    , "stylers": [{
                        "visibility": "simplified"
                }]
            }, {
                    "featureType": "road.arterial"
                    , "elementType": "labels.icon"
                    , "stylers": [{
                        "visibility": "off"
                }]
            }, {
                    "featureType": "transit"
                    , "elementType": "all"
                    , "stylers": [{
                        "visibility": "off"
                }]
            }, {
                    "featureType": "water"
                    , "elementType": "all"
                    , "stylers": [{
                        "color": "#3f89e4"
                }, {
                        "visibility": "on"
                }]
            }]
            });
            infoBox = new InfoBox({
                latlng: center
                , map: map
                , content: ''
            });
            var markers = [];
            for (var i = 0; i < 100; i++) {
                var dataPhoto = data.photos[i];
                var latLng = new google.maps.LatLng(dataPhoto.latitude, dataPhoto.longitude);
                var marker = new google.maps.Marker({
                    position: latLng
                    , map: map
                    , icon: 'images/Maps-Pin-Place-icon.png'
                    , data: dataPhoto
                });
                //extend the bounds to include each marker's position
                bounds.extend(marker.position);
                markers.push(marker);
                marker.addListener('click', openMarkerWindow);
            }
            var clusterImgPath = 'images/cluster.png';
            var mcOptions = {
                styles: [{
                    textColor: '#cf043c'
                    , textSize: 16
                    , url: clusterImgPath + '-1.png'
                    , height: 47
                    , width: 47
            }, {
                    textColor: '#cf043c'
                    , textSize: 16
                    , url: clusterImgPath + '-2.png'
                    , height: 58
                    , width: 58
            }, {
                    textColor: '#cf043c'
                    , textSize: 16
                    , url: clusterImgPath + '-3.png'
                    , height: 70
                    , width: 70
            }]
            }
            var markerCluster = new MarkerClusterer(map, markers, mcOptions);
            map.fitBounds(bounds);
        }
        google.maps.event.addDomListener(window, 'load', initialize);
