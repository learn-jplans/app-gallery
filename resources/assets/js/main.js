window.App = window.App || {};
window.App.SearchPlace = {
	init: function(){
		this.handler();
		this.installSelect2Widget();
	},
	handler: function(){

		$(document).on('change','#searchPlaceType', function(e){
			App.Maps.mapScriptLoaded();
		});
		// $(document).on('click', '#sort', function(e){
		// 	App.Maps.sortPlaces();
		// });
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
	},

	installSelect2Widget: function(){

		var data = [
		  { id: 'liquor_store', text: 'Liquor Store' },
		  { id: 'atm', text: 'ATM' },
		  { id: 'hospital', text: 'Hospital' },
		  { id: 'bakery', text: 'Bakery' },
		  { id: 'bank', text: 'Bank' },
		  { id: 'bar', text: 'Bar' },
		  { id: 'cafe', text: 'Cafe' },
		  { id: 'airport', text: 'Airport' },
		];

		$('#searchPlaceType').select2({
		  data:data
		});
	}
};

$(function(){
	App.SearchPlace.init();
});