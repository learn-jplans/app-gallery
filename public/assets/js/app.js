window.App = window.App || {};
window.App.SearchPlace = {
	init: function(){
		this.handler();
	},
	handler: function(){
		$(document).on('change','#searchPlaceType', function(e){
			console.log('handler...');
			App.Maps.mapScriptLoaded();
		});
		$(document).on('mouseover','#places li a', function(e){
			var $this = $(this);//self selector
			var data  = $this.data();
			//go to center of a marker
			App.Maps.bounceMarker(data.id, true);
		});

		$(document).on('mouseout','#places li a', function(e){
			var $this = $(this);//self selector
			var data  = $this.data();
			//reset marker
			App.Maps.bounceMarker(data.id, false);
		});
	}
};

$(function(){
	App.SearchPlace.init();
});
// window.App = window.App || {};
// window.App.Maps = {
// 	map: false,
// 	placesList: false,

// 	loadMap: function()	{
// 		var currentLocation = new google.maps.LatLng(14.59, 121.06);
// 		var el = $('#searchPlaceType option:selected').val();
// 		this.map = new google.maps.Map($('#map-canvas'), {
// 			center: currentLocation,
// 			zoom: 17
// 		});

// 		var request = {
// 			location: currentLocation,
// 			radius: 500,
// 			// types: ['bank']
// 			types: [el]
// 		};

// 		this.placesList = $('#places');
// 		this.placesList.html('');
// 		var service = new google.maps.places.PlacesService(this.map);
// 		service.nearbySearch(request, this.callback);
// 	},
// 	callback: function (results, status, pagination) {
// 		if (status != google.maps.places.PlacesServiceStatus.OK) {
// 			return;
// 		} else {
// 			// this.createMarkers(results);

// 			if (pagination.hasNextPage) {
// 			  	var moreButton = document.getElementById('more');

// 			  	moreButton.disabled = false;

// 			  	google.maps.event.addDomListenerOnce(moreButton, 'click', function() {
// 				    moreButton.disabled = true;
// 				    pagination.nextPage();
// 			 	});
// 			}
// 		}
// 	},
// };

// $(function(){
// 	// App.Maps.loadMap();
// 	google.maps.event.addDomListener(window, 'load', App.Maps.loadMap);
// });


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
		console.log(el);
		console.log(this.currentLocation);
		var request = {
			location: this.currentLocation,
			radius: 500,
			types: [el]
		};

		placesList = document.getElementById('places');
		placesList.innerHTML = '';
		var service = new google.maps.places.PlacesService(self.map);
		// service.nearbySearch(request, self.searchCallback);
		service.nearbySearch(request, function (results, status, pagination) {
		  	if (status != google.maps.places.PlacesServiceStatus.OK) {
		    	return;
		  	} else {
			    self.createMarkers(results);
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
		console.log('marker...');
		console.log(places.length);
		var self = this;
		var bounds = new google.maps.LatLngBounds();

		for (var i = 0, place; place = places[i]; i++) {
			// var image = {
			//   	url: place.icon,
			//   	size: new google.maps.Size(71, 71),
			//   	origin: new google.maps.Point(0, 0),
			//   	anchor: new google.maps.Point(17, 34),
			//   	scaledSize: new google.maps.Size(25, 25)
			// };

			// var marker = new google.maps.Marker({
			//   	map: self.map,
			//   // icon: image,
			//   	title: place.name,
			//   	position: place.geometry.location,
			//   // animation: google.maps.Animation.DROP,
			// });

			// var infowindow = new google.maps.InfoWindow();
			// google.maps.event.addListener(marker, 'click', function() {
			//   	infowindow.setContent(marker.title);
			//   	infowindow.open(self.map, this);
			// });
			// console.log(place);
			var position = place.geometry.location;
			self.insertMarker(position, place.id);

			placesList.innerHTML += '<li><a href="javascript:;" data-id="'+place.id+'">'+ place.name +'</a></li>';

			// bounds.extend(place.geometry.location);
		}
		// self.map.fitBounds(bounds);
	},
	
	getInitLocation: function(lat,longtitude) {
		var self = this;
		if(lat,longtitude){
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
		}else{
				if (navigator.geolocation) {

				self.geolocationInProgress = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					console.log(position);
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
	insertMarker: function(location, id){
		var self = this;
		// if (lat == 0 || long == 0) return false;
		if (self.mapLoaded) {

			var marker = new google.maps.Marker({
				position: location,
				map: self.map,
				tag: id
			});

			self.markers[String(id)] = marker;
		} else {
			setTimeout(function() {
				self.insertMarker(location, id);
			}, 100);
		}
	},
	addMarker: function(lat, long, id) {
		var self = this;
		if (lat == 0 || long == 0) return false;
		if (self.mapLoaded) {

			var latLong = new google.maps.LatLng(lat,long);

			var marker = new google.maps.Marker({
				position: latLong,
				map: self.map,
				tag: 'ticket-'+id
			});

			self.markers[String(id)] = marker;
		} else {
			setTimeout(function() {
				self.addMarker(lat, long, id);
			}, 100);
		}

	},

	bounceMarker: function(id, on){
		var self = this;
		if (typeof self.markers[id] === "undefined") return false;
		if (typeof self.markers[id].isBounce == "undefined") self.markers[id].isBounce = !on;
		var marker = self.markers[id];

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