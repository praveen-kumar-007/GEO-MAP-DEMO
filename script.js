
const map = L.map("map").setView([22.5726, 88.3639], 13);

// Global variables
let currentDrawer = null;
let layers = [];
let marker = null;
let savedData = [];
let selectedLayer = null;
let currentShapeType = "";

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Drawing Storage
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


// Get User LOCATION 
function getLocation() {
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

// DRAW LINE 
function drawLine() {
  document.getElementById("length").value = "";
  document.getElementById("area").value = "";
  currentDrawer = new L.Draw.Polyline(map);
  currentDrawer.enable();
}

// DRAW POLYGON 
function drawPolygon() {
  document.getElementById("area").value = "";
  document.getElementById("length").value = "";
  currentDrawer = new L.Draw.Polygon(map);
  currentDrawer.enable();
}

//LIVE LENGTH 
map.on("draw:drawvertex", function (e) {
  const tempLayers = e.layers.getLayers();
  if (!tempLayers.length) return;

  const latlngs = tempLayers.map(l => l.getLatLng());

  let totalDistance = 0;

  for (let i = 0; i < latlngs.length - 1; i++) {
    totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
  }

  document.getElementById("length").value = (totalDistance / 1000).toFixed(2);
});

//DRAW COMPLETE 
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;

  drawnItems.addLayer(layer);
  layers.push(layer);

  // Shape type
  currentShapeType = e.layerType === "polygon" ? "Polygon" : "Straightline";
  document.getElementById("shapeType").value = currentShapeType;

  // Highlight selected shape
  if (selectedLayer && selectedLayer.setStyle) {
    selectedLayer.setStyle({ color: "blue" });
  }

  selectedLayer = layer;

  if (layer.setStyle) {
    layer.setStyle({
      color: "red",
      weight: 4
    });
  }

  document.getElementById("area").value = "";
  document.getElementById("length").value = "";

  //  Polygon → Area Calculation
  if (e.layerType === "polygon") {
    const latlngs = layer.getLatLngs()[0];
    let area = L.GeometryUtil.geodesicArea(latlngs) / 1000000;
    document.getElementById("area").value = area.toFixed(2);
  }

  // Line → Final Length
  if (e.layerType === "polyline") {
    const latlngs = layer.getLatLngs();
    let total = 0;

    for (let i = 0; i < latlngs.length - 1; i++) {
      total += latlngs[i].distanceTo(latlngs[i + 1]);
    }

    document.getElementById("length").value = (total / 1000).toFixed(2);
  }

  // Show form + blur
  document.getElementById("infoPanel").classList.add("show");
  document.body.classList.add("blur-active");
});


  function undoLast() {
  if (layers.length === 0) {
    alert("Nothing to undo");
    return;
  }

  const last = layers.pop();

  // Remove from map
  drawnItems.removeLayer(last);

  // Reset selected layer if needed
  if (selectedLayer === last) {
    selectedLayer = null;
  }

  // Clear form values
  document.getElementById("area").value = "";
  document.getElementById("length").value = "";
  document.getElementById("shapeType").value = "";

  // Close panel
  document.getElementById("infoPanel").classList.remove("show");
  document.body.classList.remove("blur-active");
}

//STOP DRAWING
function stopDrawing() {
  if (currentDrawer) {
    currentDrawer.disable();
  }
}

 //SUBMIT 
document.getElementById("submitBtn").onclick = function () {

  const data = {
    placeName: document.getElementById("placeName").value,
    roadName: document.getElementById("roadName").value,
    landmark: document.getElementById("landmark").value,
    shapeType: document.getElementById("shapeType").value ,
    length: document.getElementById("length").value || null,
    area: document.getElementById("area").value || null
  };

  if (!data.placeName || !data.roadName || !data.landmark) {
    alert("Please fill all fields");
    return;
  }

  savedData.push(data);

  console.log("Final Data:", savedData);

  alert("Data Stored Successfully ✅");

  // Reset form
  document.getElementById("placeName").value = "";
  document.getElementById("roadName").value = "";
  document.getElementById("landmark").value = "";

  // Close panel
  document.getElementById("infoPanel").classList.remove("show");
  document.body.classList.remove("blur-active");
};