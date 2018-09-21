import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import './MapaAddLayersModal.css';
import ol from 'openlayers';
import LinearProgress from 'material-ui/LinearProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import MapaSearchBar from './MapaSearchBar';
import MapaResourceItem from './MapaResourceItem';

class MapaAddLayersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadedLayers: false,
      errorSearch: null,
      layers: [],
      layersSelected: [],
      searchText: ''
    };
  }
  componentWillMount() {
    this.getLayersToAdd(this.props.layersToAdd);  
  }

  componentDidMount() {
    this.getBestLayers();
  }

  getBestLayers() {
    fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?organization.title!=INEGI&name_resource')
    .then(res => res.json())
    .then((response) => {
      this.setState({isLoadedLayers: true, layers: response.results});
      this.props.thereIs();
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      this.setState({isLoadedLayers: true});
      this.props.thereNo();
      this.props.thereError(error);
    });
  }

  setStyle(layer){
    let configColor = layer.color;
    let initialColor = '#00CC99';
    let setColor = configColor ? configColor : initialColor;
    let initialStyle = new ol.style.Style();
    switch (layer.type) {
      case 'point':
        let initialPoint = new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({ color: setColor }),
          stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
        })
        initialStyle.setImage(initialPoint)
        break;
      case 'line':
        initialStyle.setStroke(new ol.style.Stroke({ color: setColor, width: 1 }))
        break;
      default:
        initialStyle.setFill(new ol.style.Fill({ color: setColor }))
        initialStyle.setStroke(new ol.style.Stroke({ color: '#000000', width: 1 }))
    }
    return initialStyle;
  }


  getLayerSource(layer){
    let urlLayer = `${process.env.REACT_APP_GEOSERVER_URL}/ckan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ckan:${layer.geoserver}&outputFormat=application/json`;
    let geojson = new ol.format.GeoJSON();
    let source = new ol.source.Vector({
      projection: 'EPSG:4326'
    });
    fetch(urlLayer)
    .then(res => res.json())
    .then((response) => {
        let features = geojson.readFeatures(response);
        source.addFeatures(features);
        if (this.props.layersToAdd.length < 1) {
          let extent = source.getExtent();
          this.props.mapa.getView().fit(extent, this.props.mapa.getSize());
        }
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
        console.log(error)
    });

    return source
  }

  createLayer(layer) {
    let newLayer = new ol.layer.Vector({
      title: layer.name_resource
        ? layer.name_resource
        : layer.geoserver,
      source: this.getLayerSource(layer),
      layerType: layer.type,
      ckan: layer.ckan,
      style: this.setStyle(layer),
    });
    return newLayer;
  }

  selectedLayer(layer) {
    let newLayer = this.createLayer(layer);
    this.props.mapa.addLayer(newLayer);
    this.props.closeModal();
    this.getBestLayers();
    this.props.layersOnMap();
  }

  changeText(event) {
    this.setState({searchText: event.target.value});
  }

  searchLayers() {
    this.getLayersSearch(this.state.searchText);
  }

  getLayersSearch(text) {
    fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?name_resource=/(' + text + ')/i')
    .then(res => res.json())
    .then((response) => {
      this.setState({isLoadedLayers: true, layers: response.results, searchText: ''});
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      this.setState({isLoadedLayers: true, errorSearch: error, searchText: ''});
    });
  }

  getLayersToAdd(layers) {
    if(layers.length > 0){
      let layersToSearch = `${process.env.REACT_APP_API_URL}/ckan-geoserver?`;
      layers.forEach(layer => {
        layersToSearch += `geoserver=${layer.idGeo}&`;
      });
      fetch(layersToSearch)
      .then(res => res.json())
      .then((response) => {
        if (response.results.length > 0) {
          let arrayToAdd = response.results;
          arrayToAdd.forEach(l => {
            let layerMetadata = layers.find(e => e.idGeo === l.geoserver);
            l.color = layerMetadata.color;
            l.order = layerMetadata.order;
          });
          let sortArray = arrayToAdd.sort(function (a, b) { return a.order - b.order });
          sortArray.map(layerToAdd => {
            let newLayer = this.createLayer(layerToAdd);
            this.props.mapa.addLayer(newLayer);
            this.props.layersOnMap();
          });
        }
      });
    }
  }

  render() {
    const { isLoadedLayers, layers} = this.state;
    if (!isLoadedLayers) {
      return < LinearProgress mode = "indeterminate" />;
    } else {
      return (<div>
        <Dialog title={
          <MapaSearchBar typing = {
            this.changeText.bind(this)
          }
          search = {
            this.searchLayers.bind(this)
          } />} open={this.props.isOpen} onRequestClose={this.props.closeModal} autoScrollBodyContent={true} contentStyle={{
            width: '80%',
            maxWidth: 'none'
          }}>
          <GridList cellHeight='auto' title='Capas Destacadas'>
            {
              layers.map(layer => (<GridTile key={layer._id}>
                <MapaResourceItem capa={layer} selected={this.selectedLayer.bind(this, layer)}></MapaResourceItem>
              </GridTile>))
            }
          </GridList>
        </Dialog>
      </div>);
    }
  }
}

export default MapaAddLayersModal;
