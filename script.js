// Initialize map
const map = L.map("map").setView([22.5726, 88.3639], 13);

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Drawing storage
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let layers = [];
let marker = null;

// Get user location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      map.setView([lat, lng], 15);

      if (marker) map.removeLayer(marker);

      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();
    });
  }
}

// Draw line
function drawLine() {
  new L.Draw.Polyline(map).enable();
}

// Draw polygon
function drawPolygon() {
  new L.Draw.Polygon(map).enable();
}

// Save drawn shapes
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);
  layers.push(layer);
});

// Undo last shape
function undoLast() {
  if (layers.length > 0) {
    const last = layers.pop();
    drawnItems.removeLayer(last);
  }
}
