window.App = window.App || {};
window.App.SearchPlace = {
	init: function(){
		this.handler();
	},
	handler: function(){
		$(document).on('change','#searchPlaceType', function(e){
			App.Maps.mapScriptLoaded();
		});
		$(document).on('click', '#sort', function(e){
			App.Maps.sortPlaces();
		});
		$(document).on('click','.table tr', function(e){

			var $this = $(this);//self selector
			var data  = $this.data();
			//go to center of a marker
			// console.log('...:'+data);
			App.Maps.bounceMarker(data.id, true);
		});

		$(document).on('mouseout','.table tr', function(e){
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