function generateLocations() {
  var locations = all[$("#city-displayed").attr('data-city-id')].locations;

  return _.map(locations, function(loc) {
    return ["<h4 class='location'><a href='" + loc.url + "' target='_blank'>" + loc.name + "</h4></a>", loc.lat, loc.lng, loc.address];
  });
}

function getCoordinator(coordinator) {
  var coordinatorLink = $("#coordinator-link");
  var coordinatorImage = $("#coordinator-image");
  var coordinatorDiv = $("#coordinator");

  $.getJSON("/coordinators", function(coordinators) {
    var fullInfo =_.find(
      coordinators.users, function(u) {
        return u.screen_name.toLowerCase() == coordinator.toLowerCase();
      });

    if(fullInfo) {
      coordinatorDiv.show();
      console.log(fullInfo.profile_image_url);
      coordinatorImage.attr("src", fullInfo.profile_image_url);
      coordinatorLink.attr("href", "http://twitter.com/" + coordinator);
      coordinatorLink.html("Contact " + fullInfo.name + " (@" + fullInfo.screen_name + ") on Twitter to get your space listed.");
    }
  });
}

$(document).ready(function(){
	var s = $('.top-side').height();
	var t = $('body').height();
	var resize = t - 400;
  var cityId

  	$('#menu-toggle').click(function() {
		$('body').toggleClass('active');
	});

	$('.city-side').css('height', resize);

	window.onresize = resizeCities;

	//set your google maps parameters
	var latitude = 32.782182,
		  longitude = -96.797600,
		  map_zoom = 14;

	//google map custom marker icon - .png fallback for IE11
	var is_internetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1;
	var marker_url = ( is_internetExplorer11 ) ? '/img/logo.png' : '/img/marker.svg';

	//define the basic color of your map, plus a value for saturation and brightness
	var	main_color = '#2a3a4d',
		  saturation_value= -20,
		  brightness_value= 5;

	//we define here the style of the map
	var style= [
		{
			//set saturation for the labels on the map
			elementType: "labels",
			stylers: [
				{saturation: saturation_value}
			]
		},
	  {	//poi stands for point of interest - don't show these lables on the map
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{visibility: "off"}
			]
		},
		{
			//don't show highways lables on the map
	    featureType: 'road.highway',
	    elementType: 'labels',
	    stylers: [
	      {visibility: "off"}
	    ]
	  },
		{
			//don't show local road lables on the map
			featureType: "road.local",
			elementType: "labels.icon",
			stylers: [
				{visibility: "off"}
			]
		},
		{
			//don't show arterial road lables on the map
			featureType: "road.arterial",
			elementType: "labels.icon",
			stylers: [
				{visibility: "off"}
			]
		},
		{
			//don't show road lables on the map
			featureType: "road",
			elementType: "geometry.stroke",
			stylers: [
				{visibility: "off"}
			]
		},
		//style different elements on the map
		{
			featureType: "transit",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.government",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.sport_complex",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.attraction",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.business",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit.station",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "landscape",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]

		},
		{
			featureType: "road",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "road.highway",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" },
				{ lightness: brightness_value },
				{ saturation: saturation_value }
			]
		}
	];

	var locations = generateLocations();

	//set google map options
	var map_options = {
    center: new google.maps.LatLng(latitude, longitude),
    zoom: map_zoom,
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    styles: style,
    animation: "DROP"
  }
  //inizialize the map
	var map = new google.maps.Map(document.getElementById('google-container'), map_options);

	var infowindow = null;

	var marker;
  var markers = new Array();
  var windows = new Array();

  infowindow = new google.maps.InfoWindow({
		content: "holding..."
	});

	for (var i = 0; i < locations.length; i++) {

	  var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+ locations[i][0] +'</h1>'+
        '<div id="bodyContent">'+
        '<p><b>' + locations[i][3] + '</b></p>'+
        '</div>'+
        '</div>';

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
      title: locations[i][0],
      icon : '/img/marker.svg',
      html: contentString,
      animation: google.maps.Animation.DROP
    });

    var newId = locations[i][0].toLowerCase().replace(/ /g, '-');

    marker.set("type", "point");
		marker.set("id", newId);
		var val = marker.get("id");

    markers.push(marker);

	windows.push(infowindow);

	google.maps.event.addListener(marker, 'click', function() {
		// infowindow.open(map,marker);
		infowindow.setContent(this.html);
		infowindow.open(map, this);
	});

  }



	//add custom buttons for the zoom-in/zoom-out on the map
	function CustomZoomControl(controlDiv, map) {
		//grap the zoom elements from the DOM and insert them in the map
	  var controlUIzoomIn= document.getElementById('cd-zoom-in'),
	  		controlUIzoomOut= document.getElementById('cd-zoom-out');
	  controlDiv.appendChild(controlUIzoomIn);
	  controlDiv.appendChild(controlUIzoomOut);

		// Setup the click event listeners and zoom-in or out according to the clicked element
		google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
		  map.setZoom(map.getZoom()+1)
		});
		google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
		  map.setZoom(map.getZoom()-1)
		});
	}
	function AutoCenter() {
    //  Create a new viewpoint bound
    var bounds = new google.maps.LatLngBounds();
    //  Go through each...
    $.each(markers, function (index, marker) {
      bounds.extend(marker.position);
    });
    //  Fit these bounds to the map
    map.fitBounds(bounds);
  }
  AutoCenter();

	var zoomControlDiv = document.createElement('div');
 	var zoomControl = new CustomZoomControl(zoomControlDiv, map);

  //insert the zoom div on the top left of the map
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);

});

function resizeCities(){
	var s = $('.top-side').height();
	var t = $('body').height();
	var resize = t - 400;

	$('.city-side').css('height', resize);

}
