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
import Header from '@boundlessgeo/sdk/components/Header';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import LeftNav from '@boundlessgeo/sdk/components/LeftNav';
import Measure from '@boundlessgeo/sdk/components/Measure';
import { Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
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

const messages = defineMessages({
  layerstab: {
    id: 'mapa.layerstab',
    description: 'Title of the layers tab',
    defaultMessage: 'Layers'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftNavOpen: false
    };
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }

  layerListOpen(value) {
    this.setState({
      addLayerOpen: true
    });
  }
  layerListClose(value) {
    this.setState({
      addLayerOpen: false
    });
  }
  leftNavOpen(value) {
    this.setState({
      leftNavOpen: true
    }, function () {
      map.updateSize();
    });
  }
  leftNavClose(value) {
    this.setState({
      leftNavOpen: false
    }, function () {
      map.updateSize();
    });
  }

  

  render() {
    const { formatMessage } = this.props.intl;
    const tabList = [
      <Tab
        disableTouchRipple={true}
        key={1}
        value={1}
        onActive={this.layerListOpen.bind(this)}
        label={formatMessage(messages.layerstab)}>
        <div id='layerlist'>
          <LayerList
            inlineDialogs={true}
            allowStyling={true}
            expandOnHover={false}
            icon={<FlatButton label="Add New Layer" />}
            showOnStart={true}
            addLayer={{ open: this.state.addLayerOpen, onRequestClose: this.layerListClose.bind(this), allowUserInput: true, sources: [{ url: 'http://10.20.55.7:8000/geoserver/wms', type: 'WMS', title: 'Datos Mx QA' }] }}
            allowFiltering={true}
            showOpacity={true}
            showDownload={true}
            showGroupContent={true}
            showZoomTo={true}
            allowReordering={true}
            map={map} />
        </div>
      </Tab>];

    var leftNavWidth = 500;
    var header = (
      <Header
        title='Soy el MAPA'
        style={{ 'z-index': 0, }}
        logo='https://i.pinimg.com/originals/e4/60/21/e460219e1373594626d48bcf955d871d.png'
        showLeftIcon={!this.state.leftNavOpen}
        onLeftIconTouchTap={this.leftNavOpen.bind(this)}>
        <Measure toggleGroup='navigation' map={map} />
        <Navigation toggleGroup='navigation' secondary={true} />
      </Header>);
      
    return (
      <div>
        <LeftNav width={leftNavWidth} tabList={tabList} open={this.state.leftNavOpen} onRequestClose={this.leftNavClose.bind(this)} />
        <div>
          {header}
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
        </div>
      </div>   
    );
  }
}

App.propTypes = {
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

App = injectIntl(App);

export default App;
