import React, { Component } from 'react';
import './App.css';
import ol from 'openlayers';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import Globe from '@boundlessgeo/sdk/components/Globe';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import Geolocation from '@boundlessgeo/sdk/components/Geolocation';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import Measure from '@boundlessgeo/sdk/components/Measure';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

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
    zoom: 6
  })
});

class App extends Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }

  render() {
    return (
      <div className="App">
        <MapPanel map={map} />
        <LoadingPanel map={map} />
        <div id='control-buttons'>
          <div id='control-button'><Globe map={map} /></div>
          <div id='control-button'><Geolocation map={map} /></div>
          <div id='control-button'><HomeButton map={map} /></div>
          <div id='control-button'><Zoom map={map} /></div>
          <div id='control-button'><Rotate map={map} /></div>
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default App;
