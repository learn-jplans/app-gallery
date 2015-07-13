$(document).ready(function(){
      $(document).on('change','#searchPlaceType', function(){
        // console.log(this.val());
        var el = $('#searchPlaceType option:selected').val();
        console.log(el);
        changeType();
      });
    });
var map, placesList;

function changeType () {
  // console.log('change');
  initialize();
}

function initialize() {
  // lat: 14.587072171797567,
    // lng: 121.06435775756836,
  var currentLocation = new google.maps.LatLng(14.585469799999998, 121.05967400000009);
  var el = $('#searchPlaceType option:selected').val();
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: currentLocation,
    zoom: 17
  });

  var request = {
    location: currentLocation,
    radius: 500,
    // types: ['bank']
    types: [el]
  };

  placesList = document.getElementById('places');
  placesList.innerHTML = '';
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);

    if (pagination.hasNextPage) {
      var moreButton = document.getElementById('more');

      moreButton.disabled = false;

      google.maps.event.addDomListenerOnce(moreButton, 'click',
          function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
    }
  }
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0, place; place = places[i]; i++) {
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      // icon: image,
      title: place.name,
      position: place.geometry.location,
      // animation: google.maps.Animation.DROP,
    });

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(marker.title);
      infowindow.open(map, this);
    });
    console.log(place.name);
    placesList.innerHTML += '<li><a href="javascript:;">'+ place.name +'</a></li>';

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);