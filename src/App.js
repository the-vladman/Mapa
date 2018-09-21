import React, {Component} from 'react';
import './App.css';
import ol from 'openlayers';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import Header from '@boundlessgeo/sdk/components/Header';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import Geolocation from '@boundlessgeo/sdk/components/Geolocation';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import Measure from '@boundlessgeo/sdk/components/Measure';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import FontIcon from 'material-ui/FontIcon';
///// my Components
import MapaAddLayersModal from './components/MapaAddLayersModal';
import MapaLayersControl from './components/MapaLayersControl';
import MapaPopUp from './components/MapaPopUp';
///// my Components
import injectTapEventPlugin from 'react-tap-event-plugin';
import {injectIntl, intlShape} from 'react-intl';
import queryString from 'query-string';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const map = new ol.Map({
  layers: [new ol.layer.Group({
      type: 'base-group',
      title: 'Base',
      layers: [new ol.layer.Tile({type: 'base', title: 'OSM Streets', source: new ol.source.OSM()})]
    })],
  controls: [
    new ol.control.Attribution({collapsible: false}),
    new ol.control.ScaleLine()
  ],
  view: new ol.View({
    projection: "EPSG:4326",
    center: [
      -101.9563, 23.6257
    ],
    zoom: 6
  })
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layerModalOpen: false,
      isLoadedModal: false,
      arelayersOnMap: false,
      showLayersControl: false,
      errorModal: null,
      layersOnControl: [],
      configLayers: []
    };
  }

  getChildContext() {
    return {muiTheme: getMuiTheme(CustomTheme)};
  }

  openAddLayerModal() {
    this.setState({layerModalOpen: true});
  }
  closeAddLayerModal() {
    this.setState({layerModalOpen: false});
  }

  isEmdebed(){
    let body = document.getElementById('body');
    let header = document.getElementById('header');
    let footer = document.getElementById('footer');
    body.style.margin = "2px";
    body.removeChild(header);
    body.removeChild(footer);
    this.changeShowLayersControl();
  }

  cleanConfig(config){
    let cleanArray = [];
    let configArray = config.replace(/[\]\[]/g, "").split(',');
    configArray.forEach((c, i)=>{
      let idGeo = '';
      let hex = '';
      let color = '';
      let order = i;
      if (c.includes(':')) {
        let cx = c.split(':');
        idGeo = cx[0];
        hex = '#' + cx[1];
        if (hex.search(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g) > -1) {
          color = hex;
        }
      } else {
        idGeo = c;
      }
      cleanArray.push({order, idGeo, color})
    });
    this.setState({configLayers: cleanArray});
  }

  componentWillMount() {
    this.getLayersOnMap();
    let values = queryString.parse(this.props.location.search);
    if(values.config){
      if(values.config.includes("[") && values.config.includes("]")){
        this.cleanConfig(values.config)
      } else{
        console.log('url invalida');
      }
    }
    if(values.embeded) {
      this.isEmdebed()
    }
  }

  getLayersOnMap() {
    let layersOnControl = map.getLayers().getArray();
    this.setState({layersOnControl})
    let layersLength = layersOnControl.length;
    if (layersLength > 2) {
      this.setState({arelayersOnMap: true});
    } else {
      this.setState({arelayersOnMap: false});
      this.setState({showLayersControl: false});
    }
  }

  thereLayersOnModal() {
    let layersOnControl = this.state.layersOnControl;
    let blan = false;
    let scrollList = document.getElementById('scroll-list');
    blan = layersOnControl.length > 6 ? false : true;
    this.setState({isLoadedModal: blan});
    if (scrollList) {
      if (layersOnControl.length > 5) {
        scrollList.style.height = '200px'
        scrollList.style.overflow ='scroll';
      } else {
        scrollList.style.height = 'unset';
        scrollList.style.overflow ='unset';
      }
    }
  }

  thereErrorOnModal(error) {
    this.setState({errorModal: error});
  }

  thereNoLayersOnModal() {
    this.setState({isLoadedModal: false});
  }

  changeShowLayersControl() {
    this.setState({
      showLayersControl: !this.state.showLayersControl
    })
  }

  render() {
    return (
      <div className="App">
        <MapaAddLayersModal mapa={map} layersToAdd={this.state.configLayers} isOpen={this.state.layerModalOpen} closeModal={this.closeAddLayerModal.bind(this)} layersOnMap={this.getLayersOnMap.bind(this)} thereIs={this.thereLayersOnModal.bind(this)} thereError={this.thereErrorOnModal.bind(this)} thereNo={this.thereNoLayersOnModal.bind(this)}/>
        {
          this.state.errorModal
            ? <p>{this.state.errorModal.message}</p>
            : null
        }
        <MapaPopUp mapa={map}/>
        <MapPanel className='mapa-panel' map={map}/>
        <LoadingPanel map={map}/>
        <div id='left-control-buttons'>
          {
            this.state.isLoadedModal
              ? <div className='control-button'>
                  <FloatingActionButton mini={true} onClick={this.openAddLayerModal.bind(this)}><ContentAdd/></FloatingActionButton>
                </div>
              : null
          }
          {
            this.state.arelayersOnMap
              ? <div id='layers-control-button' className='control-button'>
                  <FloatingActionButton mini={true} onClick={this.changeShowLayersControl.bind(this)}>
                    <FontIcon className="material-icons">layers</FontIcon>
                  </FloatingActionButton>
                </div>
              : null
          }
        </div>
        {
          this.state.showLayersControl
            ? <div id='layers-control'><MapaLayersControl mapa={map} checkAddLayer={this.thereLayersOnModal.bind(this)} layersOnControl={this.state.layersOnControl} layersOnMap={this.getLayersOnMap.bind(this)}/></div>
            : null
        }
        <div id='right-control-buttons'>
          <div className='control-button'><Geolocation map={map}/></div>
          <div className='control-button'><HomeButton map={map}/></div>
          <div className='control-button'><Zoom map={map}/></div>
          <div className='control-button'><Rotate map={map}/></div>
          <div className='control-button'>
            <FloatingActionButton mini={true}><Navigation style={{
          'left' : -4,
          'top' : -2
        }} toggleGroup='navigation' secondary={true}/></FloatingActionButton>
          </div>
          <div className='control-button'>
            <FloatingActionButton mini={true}><Measure style={{
          'left' : -4,
          'top' : -2
        }} toggleGroup='navigation' map={map}/></FloatingActionButton>
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
