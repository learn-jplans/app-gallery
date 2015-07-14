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
			if( typeof callback === 'function' ) { callback( self ); }
		});
		self.eventHandler();
		
	},

	getNearbyPlaces: function(){
		var self = this;
		var el = $('#searchPlaceType option:selected').val();
		var request = {
			location: this.currentLocation,
			radius: 500,
			types: [el]
		};
		// self.placeDetail();
		// placesList = document.getElementById('places');
		// placesList = $('#places');
		
		var service = new google.maps.places.PlacesService(self.map);
		// service.nearbySearch(request, self.searchCallback);
		service.nearbySearch(request, function (results, status, pagination) {
		  	if (status != google.maps.places.PlacesServiceStatus.OK) {
		    	return;
		  	} else {
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
		console.log(places);
		// placesList.html('');
		$('.table tbody').html('');
		for (var i = 0, place; place = places[i]; i++) {
			var position = place.geometry.location;
			self.insertMarker(position, place.id, place);
			self.getDetails(place);
		}
		
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
	            }, 500);
	        }
		});
	},
	renderPlaces: function(place){
		var self = this;
		// var search_entry = 
		// '<tr data-id="'+place.id+'">'+
  //         '<td class="place-name">'+
  //           '<span class="label-name">'+place.name+'</span>'+
  //           '<span class="label-address">'+place.formatted_address+'</span>'+
  //         '</td>'+
  //         '<td class="place-distance">1 km</td>'+
  //       '</tr>';

        var template = $('#searchEntryTemplate').html();
        var compiled = _.template(template)({
        	id: place.id,
        	name: place.name,
        	address: place.formatted_address,
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
		console.log('sorting...');
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
					self.getNearbyPlaces();
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
						console.log(place);
						
						var name 	 = '<h3>'+place.name+'</h3>',
							addlabel = '<span><strong>Address:</strong></span>',
							address  = '<p>'+place.adr_address+'</p>',
							webLabel = '<span><strong>Website:</strong></span>',
							url 	 = (_.isUndefined(place.website) ? ' N/A' : '<p><a target="_blank" href="'+place.website+'">'+place.website+'</a></p>');
						var content  = name+addlabel+address+webLabel+url;
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
			}, 100);
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
		$.each(self.markers, function(idx, marker) {
			marker.setMap(null);
		});
		self.markers = [];
		self.mapBounds = false;
		self.currentStores = [];
	},

	getLongLat: function(lat, long){
		return new google.maps.LatLng(lat, long);
	},
	computeDistance: function(longlat1, longlat2){
		var _distance = google.maps.geometry.spherical.computeDistanceBetween(
			longlat1, longlat2
		);
		return _distance / 1000;//convert meters into km
	},
};

$(function(){
	App.Maps.init();
});