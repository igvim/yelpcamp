mapboxgl.accessToken = mbxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: cg.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${cg.name}</h4><p>${cg.location}</p>`);

new mapboxgl.Marker()
    .setLngLat(cg.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)