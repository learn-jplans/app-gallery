
window.App = window.App || {};
window.App.SearchPlace = {
	init: function(){
		var self = this;
		self.handler();
		self.installSelect2Widget();
		App.Maps.getNearbyPlaces();
		// self.installListJs();
	},
	handler: function(){

		var self = this;

		$(document).on('change','#searchPlaceType', function(e){
			// App.Maps.mapScriptLoaded();
			App.Maps.clearRoute();
			App.Maps.getInitLocation();
			App.Maps.getNearbyPlaces();		
		});
		$(document).on('click', '#sort', function(e){
			App.Maps.sortPlaces();
		});
		$(document).on('click','.table tr', function(e){

			var $this = $(this);//self selector
			var data  = $this.data();
			$('.table tr').css('background','#FFF');
			$this.css('background','#ebebeb');
			//go to center of a marker
			// console.log('...:'+data);
			// self.drawRoute(data.lat, data.lng);
			// console.log(data.lat);
			$('#walk').data('lat', data.lat);
			$('#walk').data('lng', data.lng);
			$('#drive').data('lat', data.lat);
			$('#drive').data('lng', data.lng);

			App.Maps.bounceMarker(data.id, true);
			
		});
		$(document).on('click', '#walk', function(e){
			var data = $(this).data();
			App.Maps.drawRoute(data.lat, data.lng, "walking");
		});
		$(document).on('click', '#drive', function(e){
			var data = $(this).data();
			App.Maps.drawRoute(data.lat, data.lng, "driving");
		});

		$(document).on('mouseout','.table tr', function(e){
			var $this = $(this);//self selector
			var data  = $this.data();
			//reset marker
			App.Maps.bounceMarker(data.id, false);
		});
	},
	installSelect2Widget: function(){
		$('#searchPlaceType').select2({
			//category.json file dir:assets/js/
		  	data:category
		});
	},
	// installListJs: function(){
	// 	var options = {
	// 	  valueNames: [ 'place-name','place-distance' ]
	// 	};

	// 	var userList = new List('places-list', options);
	// }
};
