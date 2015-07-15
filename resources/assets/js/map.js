/*
 * Map JS component for this project
 */

window.App = window.App || {};

window.App.Maps = {
	$mapContainer: $('#map-canvas'),
	defaultZoomLevel: 10,
	autoComplete: false,
	region: "PH",
	map: false,
	directionsDisplay: false,
	mapCenter: false,
	markers: {},
	mapBounds: false,
	userLocation: false,
	currentLocation: false,
	mapLoaded: false,
	selectedLat: 0,
	selectedLng: 0,
	count:0,
	lastInfoWindow: false,
	default: {
		lat: 13.9490476,
		lng: 121.1579272,
		// lat: 14.587072171797567,
		// lng: 121.06435775756836,
		location: "Lipa Batangas, PH",
		zoomLevel: 17
	},

	init: function() {
		var self = this;
		self.loadMapScript();
	},

	loadMapScript: function() {
		var self = this;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//maps.googleapis.com/maps/api/js?v=3.exp&language=en&sensor=false&libraries=places,geometry&callback=App.Maps.mapScriptLoaded";
		document.body.appendChild(script);
	},

	mapScriptLoaded: function() {
		var self = this;

		self.loadMap( self.$mapContainer, null, function( self ) {
			self.getInitLocation();
			self.mapLoaded = true;
			// console.log('done loading map...')
			App.SearchPlace.init();
		} );
		
	},

	eventHandler: function(){
		var self = this;
		google.maps.event.addListener(self.map, "click", function (e) {
		    //lat and lng is available in e object
		    // var lat = e.latLng.lat();
		    // var lng = e.latLng.lng();
		    self.selectedLat = e.latLng.lat();
		    self.selectedLng = e.latLng.lng();

		    console.log(self.selectedLat);
		    console.log(self.selectedLng);
		    // App.Ticket.saveSelectedLatLong(self.selectedLat, self.selectedLng);
		});
	},
	loadMap: function( container, options, callback ) { //options === default
		var self = this;
		options = options || {};

		if( container.length === 0 ) {
			return false;
		}

		self.default = $.extend( self.default, options );

		self.mapCenter = new google.maps.LatLng(self.default.lat, self.default.lng);
		self.currentLocation = self.mapCenter;

		var mapOptions = {
			zoom: self.default.zoomLevel,
			center: self.mapCenter,
			scrollwheel: false,
			mapTypeControl: false,
			panControl: false,
			scaleControl: true,
			zoomControl: true,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.TOP_RIGHT
			}
		};

		container.ready(function() { // make sure the container is rendered before rendering map
			self.map = new google.maps.Map( container[0], mapOptions );
			self.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
			self.directionsDisplay.setMap(self.map);
			if( typeof callback === 'function' ) { callback( self ); }
		});
		self.eventHandler();
		
	},

	getNearbyPlaces: function(){
		var self = this;
		var el = $('#searchPlaceType option:selected').val();
		var request = {
			location: this.currentLocation,
			radius: 1500,
			types: [el],
			// rankBy: google.maps.places.RankBy.DISTANCE,//order by distance
		};
		self.clearMarker();
		var service = new google.maps.places.PlacesService(self.map);
		$('.loader').show();
		service.nearbySearch(request, function (results, status, pagination) {
		  	if (status != google.maps.places.PlacesServiceStatus.OK) {
		    	setTimeout(function(){
		    		self.getNearbyPlaces();//call self if fail
		    	}, 500);
		  	} else {
		  		// console.log('OK searching places...');
			    self.createMarkers(results);
			    //TODO 
			    if (pagination.hasNextPage) {
			      // var moreButton = document.getElementById('more');

			      // moreButton.disabled = false;

			      // google.maps.event.addDomListenerOnce(moreButton, 'click',
			      //     function() {
			      //   moreButton.disabled = true;
			      //   pagination.nextPage();
			      // });
			    }
		  	}
		});
	},

	createMarkers: function(places){
		var self = this;
		// var bounds = new google.maps.LatLngBounds();
		var service = new google.maps.places.PlacesService(self.map);
		// console.log(places);

		// placesList.html('');
		$('.table tbody').html('');
		
		for (var i = 0, place; place = places[i]; i++) {
			// console.log(place.geometry.location.lat());
			// console.log(place.geometry.location.lng());
			var position = place.geometry.location;
			self.insertMarker(position, place.id, place);
			self.getDetails(place);
		}
		$('.loader').hide();
	},
	getDetails: function(place){
		var self = this;
		var request = {
	        reference : place.reference,
	    };

	    service = new google.maps.places.PlacesService(self.map);

		service.getDetails( request, function(details, status) {//get place detail	
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				self.renderPlaces(details);
			} 
			else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
	            setTimeout(function() {
	            	//if services status fail
	                self.getDetails(place);//retry
	            }, 200);
	        }
		});
	},
	renderPlaces: function(place){
		var self = this;
        var template = $('#searchEntryTemplate').html();
        var compiled = _.template(template)({
        	id: place.id,
        	name: place.name,
        	address: place.formatted_address,
        	position: place.geometry.location,
        	distance: self.computeDistance(self.currentLocation, place.geometry.location)
        });

        $('.table tbody').append(compiled);
	},
	sortPlaces: function(){
		$('.table tr').sortElements(function (a, b){
			//sort in descending order
			// return $(a).data().distance > $(b).data().distance ? -1 : 1;
			//sort in ascending
			return $(a).data().distance > $(b).data().distance ? 1 : -1;
		});
		// console.log('sorting...');
	},
	drawRoute: function(desLat, desLng, travelMode){
		var self = this;
		
		var directionsService = new google.maps.DirectionsService();
		
		var start = App.Maps.currentLocation,
			end   = App.Maps.getLatLng(desLat, desLng);
		var _tmode = false;
		if(travelMode === "walking"){
			_tmode = google.maps.TravelMode.WALKING;
		} else if(travelMode === "driving"){
			_tmode = google.maps.TravelMode.DRIVING;
		}
		var request = {
		  	origin: start,
		  	destination: end,
		  	// travelMode: google.maps.TravelMode.DRIVING
		  	travelMode: _tmode
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			  	App.Maps.directionsDisplay.setDirections(response);
			}
		});
		
	},
	clearRoute: function() {
		this.directionsDisplay.setDirections({ routes: [] });
	},
	getInitLocation: function(lat,longtitude) {
		var self = this;
		if(lat,longtitude) {
					self.mapCenter = new google.maps.LatLng(lat, longtitude);
					self.currentLocation = self.mapCenter;
					self.userLocation = self.mapCenter;
					self.map.setZoom(self.default.zoomLevel);
					self.map.setCenter(self.mapCenter);
					self.geolocationInProgress = false;

					self.initDefaultGeoInterval = setInterval(function(){
						if(!self.geolocationInProgress) {
								clearInterval(self.initDefaultGeoInterval);
							}
					}, 200);
		} else {
				if (navigator.geolocation) {

				self.geolocationInProgress = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					// console.log(position);
					self.mapCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					self.currentLocation = self.mapCenter;
					self.userLocation = self.mapCenter;
					self.map.setZoom(self.default.zoomLevel);
					self.map.setCenter(self.mapCenter);
					self.geolocationInProgress = false;
					self.ownMarker(self.currentLocation,231);
				}, function(error) {
					self.geolocationInProgress = false;
				}, { maximumAge: 600000, timeout:10000 });

				self.initDefaultGeoInterval = setInterval(function(){
					if(!self.geolocationInProgress) {
						clearInterval(self.initDefaultGeoInterval);
					}
				}, 200);
			}
		}
	},
	ownMarker: function(position, id){
		var image = '/assets/images/circle-marker.png';
		// var myLatLng = new google.maps.LatLng(-33.890542, 151.274856);
		var ownMarker = new google.maps.Marker({
			position: position,
			map: this.map,
		  	icon: image
		});
	},
	insertMarker: function(location, id, place){
		var self = this;
		// if (lat == 0 || long == 0) return false;
		if (self.mapLoaded) {

			var request = {
				placeId: place.place_id
			};

			
			var service = new google.maps.places.PlacesService(self.map);

		  	var marker = new google.maps.Marker({
				position: location,
				map: self.map,
				tag: id,
				// title: place.name
			});

			self.markers[String(id)] = marker;
		  	google.maps.event.addListener(marker, 'click', function() {
		    	service.getDetails(request, function(place, status) {//get place detail	
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						// console.log(place);
						
						var name 	 = '<h3>'+place.name+'</h3>',
							addlabel = '<span><strong>Address:</strong></span>',
							address  = '<p>'+place.adr_address+'</p>',
							phonelbl = '<span><strong>Contact #:</strong></span>',
							phone  	 = '<p>'+(_.isUndefined(place.formatted_phone_number) ? ' N/A' : place.formatted_phone_number)+'</p>',
							webLabel = '<span><strong>Website:</strong></span>',
							url 	 = '<p>'+(_.isUndefined(place.website) ? ' N/A' : '<a target="_blank" href="'+place.website+'">'+place.website+'</a>')+'</p>';

						var content  = name+addlabel+address+phonelbl+phone+webLabel+url;

						if(self.lastInfoWindow){
							//prevent multiple infowindow open
							self.lastInfoWindow.close();
						}

						var infowindow = new google.maps.InfoWindow({
							content: content,
							maxWidth: 200
						});

		    			infowindow.open(self.map, marker);
		    			// reassign the new infowindow to be close
		    			// when new info window opened
		    			self.lastInfoWindow = infowindow;
					}
				});
		  	});
		} else {
			setTimeout(function() {
				self.insertMarker(location, id, place);
			}, 200);
		}
	},

	bounceMarker: function(id, on){
		var self = this;
		// console.log(id);
		// console.log('self.markers[id]='+self.markers[id]);
		// console.log('self.markers[id].isBounce='+self.markers[id].isBounce);
		if (typeof self.markers[id] === "undefined") return false;
		if (typeof self.markers[id].isBounce == "undefined") self.markers[id].isBounce = !on;
		var marker = self.markers[id];
		// console.log(on+':bounce:'+id);
		if (marker.isBounce == on) return false;
		self.markers[id].isBounce = on;

		if (on) {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			self.map.panTo(marker.getPosition());
		} else {
			marker.setAnimation(null);
		}

	},

	clearMarker: function(){
		var self = this;
		// Object.keys(self.markers)
		// $.each(self.markers, function(idx, marker) {
		// 	marker.setMap(null);
		// });
		// var marker;
		// for(self.markers in marker){
		// 	console.log('removing marker...');
		// 	marker.setMap(null);
		// }
		$.each(Object.keys(self.markers), function(index, marker) {
		  	// marker.setMap(null);
		  	self.markers[marker].setMap(null);
		});

		self.markers = [];
		self.mapBounds = false;
		self.currentStores = [];
	},

	getLatLng: function(lat, long){
		return new google.maps.LatLng(lat, long);
	},
	computeDistance: function(longlat1, longlat2){
		var _distance = google.maps.geometry.spherical.computeDistanceBetween(
			longlat1, longlat2
		);
		return _distance;
	},
};

$(function(){
	App.Maps.init();
});