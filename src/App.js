import React, { Component } from 'react';
import './App.css';
import ol from 'openlayers';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';

var map = new ol.Map({
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base Maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'OSM Streets',
          source: new ol.source.OSM()
        })
      ]
    })
  ],
  controls: [new ol.control.Attribution({ collapsible: false }), new ol.control.ScaleLine()],
  view: new ol.View({
    projection: "EPSG:4326",
    center: [-101.9563, 23.6257],
    zoom: 5
  })
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">Soy el Mapa</h1>
        <MapPanel map={map} />
        <LoadingPanel map={map} />
      </div>
    );
  }
}

export default App;
