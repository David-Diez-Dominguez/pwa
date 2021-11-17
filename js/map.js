function initMap() {
    var options = {
        zoom: 10,
        minZoom: 3,
        center: {
            lat: 50.10,
            lng: 8.5
        }
    }
    var map = new
        google.maps.Map(document.getElementById('map'), options);
  
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var picture = '/img/ffm.jpeg';
            addMarker({ lat, lng }, picture);
  
        });
    }
    else {
        console.log("geolocation is not supported");
    }
  
  
    addMarker({ lat: 48.5, lng: 2.0 }, "/img/paris.jfif");
  
    //add marker function
    function addMarker(coords, picture) {
        var marker = new google.maps.Marker({
            position: coords,
            animation: google.maps.Animation.DROP,
            map: map,
        });
  
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 150,
            content: `<img src="${picture}" style="width: 120px; height: 100px;">`,
        })
  
        infowindow.open(map, marker);
  
        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
            });
        });
  
  
  
    }
  
  
  }
  