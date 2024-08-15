// let maptoken=mapToken;
// mapboxgl.accessToken = maptoken;
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11', // Add a style
//     center: coordinates,
//     zoom: 9
// });

// // Create a popup
// const popup = new mapboxgl.Popup({ offset: 25 })
//     .setHTML(`<h3>${listing.title}</h3><p>${listing.location}</p>`);

// // Create the marker with custom properties
// const marker1 = new mapboxgl.Marker({
//     color: "#FF0000",
//     draggable: true
// })
// .setLngLat(coordinates)
// .setPopup(popup) // Attach the popup to the marker
// .addTo(map);

// // Change marker color when clicked
// marker1.getElement().addEventListener('click', () => {
//     const currentColor = marker1.getElement().style.color;
//     const newColor = currentColor === 'rgb(0, 0, 255)' ? '#FF0000' : '#0000FF';
//     marker1.setColor(newColor);
// });

// // Log new position when marker is dragged
// marker1.on('dragend', () => {
//     const lngLat = marker1.getLngLat();
//     console.log(`New marker position: ${lngLat.lng}, ${lngLat.lat}`);
// });

// //basic marker
// // const marker1 = new mapboxgl.Marker()
// // .setLngLat(coordinates)
// // .addTo(map);

let maptoken = mapToken;
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 9
});

// Create a popup
const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>${listing.title}</h3><p>${listing.location}</p>`);

// Create the marker with custom properties
const marker1 = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: false
})
.setLngLat(coordinates)
.setPopup(popup) // Attach the popup to the marker
.addTo(map);

// Function to fly to the marker
function flyToMarker() {
    map.flyTo({
        center: coordinates,
        zoom: 14,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
}

// Fly to marker when map loads
map.on('load', flyToMarker);

// Fly to marker when clicked
marker1.getElement().addEventListener('click', flyToMarker);

// Add a 'Find on map' button
const mapContainer = document.getElementById('map');
const findButton = document.createElement('button');
findButton.textContent = 'Find on map';
findButton.className = 'find-on-map-btn';
findButton.addEventListener('click', flyToMarker);
mapContainer.appendChild(findButton);