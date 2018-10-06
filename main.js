// $(function name() {
  
//   var form = document.querySelector('#form')
//   form.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     console.log(e)
//   })
//  /* firebase setup */


// })

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
db.collection('users').get().then(querySpapshot=>{
  querySpapshot.forEach(doc=>{
    console.log(doc.data( ));
  })
})
var locations = [
  { name: 'Nahid', position: {lat:  23.787021, lng: 90.367699}},
  { name: 'Enayet', position: {lat: 23.787236, lng: 90.368913}},
  { name: 'sisir' , position: {lat: 23.845209, lng: 90.258579}},
  { name: 'tumpa' , position: {lat: 23.722489, lng: 90.388458}},
  { name: 'sohel' , position: {lat: 23.764836, lng: 90.415023}},
  { name: 'jewel' , position: {lat: 23.761043, lng: 90.433999} },
  { name: 'sojib' , position: {lat: 23.749141, lng: 90.442808}},
  { name:'home' , position: {lat: 23.168585, lng: 90.195961}},
  { name: 'baly' , position: {lat: 23.168431, lng: 90.207002}},

]
function initMap(){
  var map 


  var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);
     
  $(function() {
    var $name = $('.name')
    var $lat = $('.lat')
    var $lng = $('.lng')
    var form = document.querySelector('#form')
    form.addEventListener('submit',(e)=>{
      e.preventDefault()
      
      
      db.collection('users').add({
        name: $name.val(),
        location:{
          lat: parseFloat($lat.val()),
          lng: parseFloat($lng.val()),
        }
      }).then(querySpapshot=>{
          name: $name.val ="",
        // 'location.lat': $lat.val(),
        // 'location.lng': $lng.val(),
       alert('successfully added')
        console.log(querySpapshot)
      }).catch(err=>{
        console.log(err)
      })
    })
   
  })

  window.eqfeed_callback = function(res){
    
    navigator.geolocation.watchPosition(data=>{
      var center = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      };
      var options = {
        zoom: 4,
        center: center,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        // gestureHandling: 'cooperative',
        streetViewControlOptions: {
            // position: google.maps.ControlPosition.LEFT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            // position: google.maps.ControlPosition.LEFT_CENTER
        },
        fullscreenControl: true,
        mapTypeControlOptions: {
          // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          // position: google.maps.ControlPosition.TOP_CENTER,
          mapTypeIds: ['roadmap', 'terrain','satellite']
        }
      }
      /* find me porttion */
      function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'darkgreen';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.padding = '2px 5px';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to Recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = '#fff';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Find Me';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          setTimeout(() => {
            map.setCenter(center);
          map.setZoom(15);
          }, 1000);
         
        });

      }

      map = new google.maps.Map(document.querySelector('.map'),options)
      var marker = new google.maps.Marker({
        position: center,
        map:map,
        animation: google.maps.Animation.DROP,
        label: 'self',
        title:'My Current Location'
      })
      
      // addMarker(center,"imran", map);
      // var markers = locations.map(location=>{
      //   return new google.maps.Marker({
      //     position: location.position,
      //     label: location.name
      //   }) 
      // })
      /* earth queck marker cluster */
      function addMarker(position, label, map){
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var marker = new google.maps.Marker({
          position: position,
          map:map,
          label: label,
          icon: image,
          title:'My Current Location'
        })
      }
      /* relative location cluster */
      db.collection('users').get().then(snapShot=>{
        var markers = []
        snapShot.forEach(user=>{
          let marker = new google.maps.Marker({
            position: user.data().location,
            label:user.data().name
          })
          markers.push(marker)
        })
        var markerClaster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})

      })

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, 'click', function(event) {
        var marker
        if(map.zoom > 15){
          marker = null
          // marker = addMarker(event.latLng,"place", map);
           marker = new google.maps.Marker({
            position: event.latLng,
            map:map,
            label: 'label',
            title:'add Location'
          })
          var lat = event.latLng.lat()
          var lng = event.latLng.lng()
         $('.lat').attr('value', lat)
         $('.lng').attr('value', lng)
        }
         
      });
      // eq data
      // find me implementation
      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, map);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      // map.data.addGeoJson(res);
      
      
      // map.data.setStyle(function(feature) {
      //   var magnitude = feature.getProperty('mag');
      //   console.log(google.maps.SymbolPath);
      //   return {
      //     icon: getCircle(magnitude)
      //   };
      // });
      // function getCircle(magnitude) {
      //   return {
      //     path: google.maps.SymbolPath.CIRCLE,
      //     fillColor: 'red',
      //     fillOpacity: .2,
      //     scale: Math.pow(2, magnitude) / 2,
      //     strokeColor: 'white',
      //     strokeWeight: .5
      //   };
      // }

    // map2 = new google.maps.Map(document.querySelector('.map2'),{
    //   center:{lat:25, lng:30},
    //   zoom:1
    // })
    /* earth quick data */
    var eQMarker = []
      for(var i = 0; i< res.features.length; i++){
        if(res.features[i].properties.mag > 5){
          // console.log(res.features[i].properties);
          let lat = res.features[i].geometry.coordinates[1]
          let lng = res.features[i].geometry.coordinates[0]
          let latLng = new google.maps.LatLng(lat, lng)
          var eMarker= new  google.maps.Marker({
            position: latLng,
            map:  map,
            label: res.features[i].properties.place + " Range = " + res.features[i].properties.mag
          })
          eQMarker.push(eMarker)          
        }        
      }
     
      var markerClaster2 = new MarkerClusterer(map, eQMarker,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})   
  
    }) // nd of navigator
  }
}  
/* 
  23.787021, 90.367699 nahid
  23.787236, 90.368913 enayet
  23.845209, 90.258579 sisir
  23.722489, 90.388458 tumpa
  23.764836, 90.415023 sohel
  23.761043, 90.433999 jewel
  23.749141, 90.442808 sojib
  23.168585, 90.195961 home
  23.168431, 90.207002 baly


  image path
  'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
*/
