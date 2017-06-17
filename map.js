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
