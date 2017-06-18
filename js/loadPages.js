// HTML template strings
formPage = '<!-- Page Heading --><div class="row"> <div class="col-lg-12"> <!-- <h1 class="page-header"> Form </h1> --> <ol class="breadcrumb"> <li> <i class="fa fa-dashboard"></i>  <a href="index.html">Dashboard</a> </li> <li class="active"> <i class="fa fa-edit"></i> Form </li> </ol> </div> </div> <!-- /.row --> <div class="row"> <div class="col-lg-12"> <form role="form" name="formING" onsubmit="submitForm()"> <div class="form-group"> <label>Customer</label> <input class="form-control"> </div> <div class="form-group"> <label>KVK nummer</label> <input class="form-control"> </div> <div class="form-group"> <label>Adres</label> <input class="form-control"> </div> <div class="form-group"> <label>Postcode</label> <input class="form-control"> </div> <div class="form-group"> <label>Gemeente</label> <input class="form-control"> </div> <div class="form-group"> <label>Aangevraagde lening</label> <input class="form-control"> </div> <div class="form-group"> <label>Type lening</label> <input class="form-control"></div><button type="submit" class="btn btn-default">Submit Button</button> <button type="reset" class="btn btn-default">Reset Button</button> </form> </div> </div> <!-- /.row -->'

mapPage = '<!-- <h1 class="page-header"> Map </h1> --> <ol class="breadcrumb"> <li> <i class="fa fa-dashboard"></i>  <a href="index.html">Dashboard</a> </li> <li class="active"> <i class="fa fa-edit"></i> Map </li> </ol> <!-- Page Heading --> <div class="row"> <div class="col-lg-12"> <nav id="menu"></nav> <div id="map"></div> </div> </div> <!-- /.row -->'


// Load HTML template strings
$( document ).ready(function(){
  $(".container-fluid").html(formPage);
});

$("#formPage").click(function(){
  $(".container-fluid").html(formPage);
});

$("#mapPage").click(function(){
  $(".container-fluid").html(mapPage);
  loadMap();
});

function submitForm() {
  console.log("submit form");
  $(".container-fluid").html(mapPage);
  loadMap();
}


// Function to load map and add data
function loadMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaXZvMTEyMzUiLCJhIjoieV82bFVfNCJ9.G8mrfJOA07edDDj6Bep2bQ';
  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/ivo11235/cj40zzvy43klk2rozfylmtc5y', //hosted style id
      center: [4.951721,52.314182], // starting position
      zoom: 14 // starting zoom
  });
  map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
  }));

  map.on('load', function () {
  	bounds = map.getBounds()
  	ne = [bounds._ne.lat,bounds._ne.lng]
  	sw = [bounds._sw.lat,bounds._sw.lng]
  	bbox = 'bbox='+sw[1]+","+sw[0]+","+ne[1]+","+ne[0];
  	console.log("load data for "+bbox);
    // wfs_url = 'https://geodata.nationaalgeoregister.nl/bag/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=bag:pand&SRSNAME=EPSG:4326&'+bbox+'&outputFormat=json'
    wfs_url = 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=cbs_gemeente_2016_gegeneraliseerd&SRSNAME=EPSG:4326&%27+bbox+%27&outputFormat=json'
  	$.ajax({url: wfs_url
  	, success: function(result){
  		console.log(result);
  		// try {
  		// 	map.removeLayer('bag');
  		// } catch(err) {
  		// 	console.log(err)
  		// }

  		geojson = {
  		'type': 'geojson',
  		'data': result
  		}
  		console.log(geojson);
  		map.addSource ( "wfs", geojson )

  		map.addLayer({
          "id": "CBS gemeenten 2016",
          "type": "fill",
          "source": "wfs",
  				'paint': {
  						'fill-color': '#088',
  						'fill-opacity': 0.8,
              'fill-outline-color': '#000'
  				}
      });
    }});

    var toggleableLayerIds = [ 'CBS gemeenten 2016' ];

  for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = id;

      link.onclick = function (e) {
          var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

          if (visibility === 'visible') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
          } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
          }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);
  }
  });

}
