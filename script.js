// Initialize map
const map = L.map("map").setView([22.5726, 88.3639], 13);

// Global variables
let currentDrawer = null;
let layers = [];
let marker = null;
let savedData = [];

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Drawing storage
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Custom dot
const customDot = new L.DivIcon({
  className: "custom-dot",
  iconSize: [8, 8]
});

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
  document.getElementById("length").value = "";

  currentDrawer = new L.Draw.Polyline(map, {
    icon: customDot
  });
  currentDrawer.enable();
}

// Draw polygon
function drawPolygon() {
  document.getElementById("area").value = "";

  currentDrawer = new L.Draw.Polygon(map, {
    icon: customDot
  });
  currentDrawer.enable();
}


map.on("draw:drawvertex", function (e) {
  const tempLayers = e.layers.getLayers();

  if (!tempLayers.length) return;

  let latlngs = tempLayers.map(l => l.getLatLng());

  let totalDistance = 0;

  for (let i = 0; i < latlngs.length - 1; i++) {
    totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
  }

  totalDistance = totalDistance / 1000;

  document.getElementById("length").value = totalDistance.toFixed(2);
});

//Save shape & calculations
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);
  layers.push(layer);

  const panel = document.getElementById("infoPanel");
  const areaInput = document.getElementById("area");
  const lengthInput = document.getElementById("length");

  areaInput.value = "";
  lengthInput.value = "";

  //Area calculation
  if (e.layerType === "polygon") {
    const latlngs = layer.getLatLngs()[0];
    let area = L.GeometryUtil.geodesicArea(latlngs);
    area = area / 1000000;
    areaInput.value = area.toFixed(2);
  }

  // FINAL LENGTH
  if (e.layerType === "polyline") {
    let latlngs = layer.getLatLngs();
    if (Array.isArray(latlngs[0])) 
    {
      latlngs = latlngs[0];
    }
    let totalDistance = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
    }
    totalDistance = totalDistance / 1000;
    lengthInput.value = totalDistance.toFixed(2);
  }
  panel.classList.add("show");
});

//Undo last shape
function undoLast() {
  if (layers.length > 0) {
    const last = layers.pop();
    drawnItems.removeLayer(last);
  }
}

// Stop drawing
function stopDrawing() {
  if (currentDrawer) {
    try {
      currentDrawer.completeShape();
    } catch (e) {}
    currentDrawer.disable();
  }
}

// Submit data
document.getElementById("submitBtn").onclick = function () {

  const id = document.getElementById("mapId").value;
  const landmark = document.getElementById("landmark").value;
  const area = document.getElementById("area").value;
  const length = document.getElementById("length").value;

  if (!id || !landmark) {
    alert("Please fill ID and Landmark");
    return;
  }

  const data = {
    id: id,
    landmark: landmark,
    area: area,
    length: length
  };

  savedData.push(data);

  console.log("Saved Data:", savedData);

  alert("Data Submitted Successfully!");

  document.getElementById("mapId").value = "";
  document.getElementById("landmark").value = "";
};