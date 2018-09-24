import React, { Component } from 'react';
import './MapaLayersControl.css';
import ol from 'openlayers';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ColorLensIcon from 'material-ui/svg-icons/image/color-lens';
import TonalityIcon from 'material-ui/svg-icons/image/tonality';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import ZoomInIcon from 'material-ui/svg-icons/device/location-searching';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import Slider from 'material-ui/Slider';
import { HuePicker } from 'react-color';

class MapaLayersControl extends Component {

  handleSlider(layer, event, value){
    layer.setOpacity(value);
    this.props.layersOnMap();
  }

  getLayerColor(layer){
    let layerColor = '';
    switch (layer.getProperties().layerType) {
      case 'point':
        layerColor = layer.getStyle().getImage().getFill().getColor();
        break;
      case 'line':
        layerColor = layer.getStyle().getStroke().getColor();
        break;
      default:
        layerColor = layer.getStyle().getFill().getColor();
    }
    return layerColor;
  }

  setNewStyle(type, newColor){
    let newStyle = new ol.style.Style();
    switch (type) {
      case 'point':
        let initialPoint = new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({ color: newColor }),
          stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
        })
        newStyle.setImage(initialPoint)
        break;
      case 'line':
        newStyle.setStroke(new ol.style.Stroke({ color: newColor, width: 1 }))
        break;
      default:
        newStyle.setFill(new ol.style.Fill({ color: newColor }))
        newStyle.setStroke(new ol.style.Stroke({ color: '#000000', width: 1 }))
    }
    return newStyle;
  }

  handleChangeColor(layer, color, event){
    let newStyle = this.setNewStyle(layer.getProperties().layerType, color.hex);
    layer.setStyle(newStyle);
    this.props.layersOnMap();
  }

  deleteLayer(layer){
    this.props.mapa.removeLayer(layer);
    this.props.layersOnMap();
    this.props.checkAddLayer();
  }
  componentDidMount() {
    let layersOnControl = this.props.layersOnControl;
    let scrollList = document.getElementById('scroll-list');
    if (scrollList) {
      if (layersOnControl.length > 5) {
        scrollList.style.height = '200px';
        scrollList.style.overflow ='scroll';
      } else {
        scrollList.style.height = 'unset';
        scrollList.style.overflow ='unset';
      }
    }
  }

  editLayerMenu(layer){
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText={<HuePicker color={this.getLayerColor(layer)} width={180} onChange={ this.handleChangeColor.bind(this, layer) } />} leftIcon={<ColorLensIcon />} />
        <MenuItem primaryText={<Slider value={layer.getOpacity()} onChange={this.handleSlider.bind(this, layer)} style={{ width: '180px', height: '10px' }} />} leftIcon={<TonalityIcon />} />
        <Divider />
        <MenuItem onClick={this.deleteLayer.bind(this,layer)} style={{ color: 'red' }} primaryText="Eliminar capa del mapa" />
      </IconMenu>)
  }

  showLayer(layer){
    let isVsible = layer.getVisible();
    layer.setVisible(!isVsible);
    this.props.layersOnMap();
  }

  zoomToLayer(layer) {
    let extent = layer.getSource().getExtent();
    this.props.mapa.getView().fit(extent, this.props.mapa.getSize());
  }

  layerControlElement(layer){
    return(
      <div className='layers-control-element'>
        <p className='layers-control-title'>{layer.getProperties().title}</p>
      </div>
    )
  }

  layerControlButtons(layer){
    return(
      <div className='layers-control-buttons'>
        <IconButton className='layer-button'><LayersIcon color={this.getLayerColor(layer)}/></IconButton>
        <IconButton className='show-layer-button' onClick={this.showLayer.bind(this, layer)}>{layer.getVisible() ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
        <IconButton className='zoom-to-layer-button' onClick={this.zoomToLayer.bind(this, layer)}><ZoomInIcon /></IconButton>
      </div>
    )
  }

  render() {
    let {layersOnControl} = this.props;
    return(
      <div className='layers-control-container'>
        <Paper elevation={1}>
            <div id='layers-control-header'>
              <h1 id='layers-control-text'>Capas</h1>
            </div>
            <div id='scroll-list' className='layers-control-list'>
              <List>
                {
                  layersOnControl.map((layer, i) => {
                  return (layer.getProperties().layerType) ? <ListItem className='list-item-control' key={layersOnControl.indexOf(layer)} primaryText={this.layerControlElement(layer)} leftIcon={this.layerControlButtons(layer)} rightIcon={this.editLayerMenu(layer)} /> : null
                  })
                }
              </List>
            </div>
        </Paper>
      </div>
    );
  }
}

export default MapaLayersControl;
