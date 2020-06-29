var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var layer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var center = ol.proj.fromLonLat([32, 39]);

var view = new ol.View({
    center: center,
    zoom: 10
});

var map = new ol.Map({
    target: 'map',
    view: view,
    layers: [layer]
});

var vectorSource = new ol.source.Vector({
    url:"/api/data",
    format: new ol.format.GeoJSON({ featureProjection: "EPSG:4326" })
});

var vectorSource2 = new ol.source.Vector({
    url:"/api/data2",
    format: new ol.format.GeoJSON({ featureProjection: "EPSG:4326" })
});

var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 15],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: 'https://img.icons8.com/plasticine/100/000000/coniferous-tree.png'
    }))
    })
});

var markerVectorLayer2 = new ol.layer.Vector({
    source: vectorSource2,
    style: new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 15],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: 'https://img.icons8.com/flat_round/64/000000/tree.png'
    }))
    })
});

map.addLayer(markerVectorLayer);
map.addLayer(markerVectorLayer2);
var select = new ol.interaction.Select({multiple:false});
select.on('select', fnHandler);
map.addInteraction(select);
map.on("click",handleMapClick);

function handleMapClick(evt) {
    var coord=ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    document.getElementById("Latitude").value=coord[1];
    document.getElementById("Longitude").value=coord[0];
}

function fnHandler(e) {
    var coord = e.mapBrowserEvent.coordinate;
    let features = e.target.getFeatures();
    features.forEach( (feature) => {
        console.log("Tree Type: " + feature.getProperties().tree_type);
        console.log("Tree Height: " + feature.getProperties().height);
        document.getElementById("tree_type").value=feature.getProperties().tree_type;
    });
    
    if (e.selected[0]) {
        var coords=ol.proj.transform(e.selected[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        document.getElementById("Latitude").value=coords[1];
        document.getElementById("Longitude").value=coords[0];
        console.log(coords);
 }
}

function submit() 
{ 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var data=JSON.stringify({
 
        Latitude: document.getElementById('Latitude').value,
        Longitude: document.getElementById('Longitude').value,
        tree_type: document.getElementById('tree_type').value,
        Height: document.getElementById('Height').value
    });
    xhr.send(data);
}
