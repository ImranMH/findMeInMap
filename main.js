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
// var storage = firebase.storage();

// var storageRef = storage.ref('mapIcon');
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

function initMap(){
  var map 
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(data=>{
      console.log(data)
    })
  }else{
    console.log('location service is off');
  } 
  $(function() {
    // $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCf7ciwQOMLiOnmMLUITm5fJm0-rlc9qJA", data=>{
    //   console.log(data)
    // })
    var $name = $('.name')
    var $location = $('.location')
    var $lat = $('.lat')
    var $lng = $('.lng')
    var form = document.querySelector('#form')

    /* adding place to database */
    form.addEventListener('submit',(e)=>{
      e.preventDefault()    
      db.collection('users').add({
        name: $name.val(),
        placeName: $location.val(),
        location:{
          lat: parseFloat($lat.val()),
          lng: parseFloat($lng.val()),
        }
      }).then(querySpapshot=>{
         
       alert('successfully added')
      }).catch(err=>{
        console.log(err)
      })
    })


  })

  // var center = {
  //   lat: 20,
  //   lng: 70
  // };

    navigator.geolocation.getCurrentPosition(data=>{
      var center = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      };
      var options = {
        zoom: 5,
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
 
      /* self marker */
      map = new google.maps.Map(document.querySelector('.map'),options)
      var contentString = `<div> 
                            <h> Your current Location </h>                            
                            Latitde : ${center.lat}
                            Longitude : ${center.lng}
                          </div> `
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
      var icon = "https://firebasestorage.googleapis.com/v0/b/mapapp-669f0.appspot.com/o/mapIcon%2Fmale-2.png?alt=media&token=1c95d933-f42d-4207-8bbb-bcd53229f63b"
      var marker = new google.maps.Marker({
        position: center,
        map:map,
        icon: icon,
        animation: google.maps.Animation.DROP,
        label: 'You',
        title:'My Current Location'
      })
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
      

      /* earth queck marker cluster */
      // function addMarker(position, label, map){
      //   var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      //   var marker = new google.maps.Marker({
      //     position: position,
      //     map:map,
      //     label: label,
      //     icon: image,
      //     title:'My Current Location'
      //   })
      // }
      /* relative location cluster */
          /* fatching data from */
    db.collection('users').get().then(snapShot=>{
        
      var imageHome = "https://firebasestorage.googleapis.com/v0/b/mapapp-669f0.appspot.com/o/mapIcon%2Fhome-2.png?alt=media&token=afcbc903-0a67-43c3-8499-be9f700b5501"
      var markers = []
      snapShot.forEach(user=>{
        let marker = new google.maps.Marker({
          position: user.data().location,
          label:user.data().name,
          icon: imageHome
        })
        markers.push(marker)
        var contentString = `<div class="infoWindw"> 
        <h2> name: ${user.data().name} </h2>
        <h3>location : ${user.data().placeName? user.data().placeName : ""}  </h3>         
        <h3> Latitde : ${user.data().location.lat} </h2>
        <h3> Longitude : ${user.data().location.lng} </h3>
                  
      </div> `
        var infowindow = new google.maps.InfoWindow({
        content: contentString
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      })
      
      var markerClaster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
      
    })

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, 'click', function(event) {
        var marker
        if(map.zoom > 15){
          
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
      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, map);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      // map.data.addGeoJson(res);
      
      

     
  
    }) // nd of navigator
  
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
// db.collection('users').get().then(querySpapshot=>{
//   querySpapshot.forEach(doc=>{
//     console.log(doc.data( ));
//   })
// })
/* var locations = [
  { name: 'Nahid', position: {lat:  23.787021, lng: 90.367699}},
  { name: 'Enayet', position: {lat: 23.787236, lng: 90.368913}},
  { name: 'sisir' , position: {lat: 23.845209, lng: 90.258579}},
  { name: 'tumpa' , position: {lat: 23.722489, lng: 90.388458}},
  { name: 'sohel' , position: {lat: 23.764836, lng: 90.415023}},
  { name: 'jewel' , position: {lat: 23.761043, lng: 90.433999} },
  { name: 'sojib' , position: {lat: 23.749141, lng: 90.442808}},
  { name:'home' , position: {lat: 23.168585, lng: 90.195961}},
  { name: 'baly' , position: {lat: 23.168431, lng: 90.207002}},

] */