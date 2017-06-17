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
	bbox = 'bbox='+sw[0]+","+sw[1]+","+ne[0]+","+ne[1];
	console.log("load data for "+bbox);
	$.ajax({url: 'https://geodata.nationaalgeoregister.nl/bag/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=bag:pand&SRSNAME=EPSG:4326&'+bbox+'&outputFormat=json'
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
		map.addSource ( "bag_pand", geojson )

		map.addLayer({
        "id": "bag",
        "type": "fill",
        "source": "bag_pand",
				'paint': {
						'fill-color': '#088',
						'fill-opacity': 0.8
				}
    });
  }});
});
