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