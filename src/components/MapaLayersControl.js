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
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import Slider from 'material-ui/Slider';
import { HuePicker } from 'react-color';

class MapaLayersControl extends Component {

  handleSlider(layer, event, value){
    layer.setOpacity(value);
    this.props.layersOnMap();
  }

  handleChangeColor(layer, color, event){
    const newStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: color.hex }),
      stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
    });
    layer.setStyle(newStyle);
    this.props.layersOnMap();
  }

  deleteLayer(layer){
    this.props.mapa.removeLayer(layer);
    this.props.layersOnMap();
  }

  editLayerMenu(layer){
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText={<HuePicker color={layer.getStyle().getFill().getColor()} width={180} onChange={ this.handleChangeColor.bind(this, layer) } />} leftIcon={<ColorLensIcon />} />
        <MenuItem primaryText={<Slider value={layer.getOpacity()} onChange={this.handleSlider.bind(this, layer)} style={{ width: '180px', height: '10px' }} />} leftIcon={<TonalityIcon />} />
        <Divider />
        <MenuItem onClick={this.deleteLayer.bind(this,layer)} style={{ color: 'red' }} primaryText="Borrar" />
      </IconMenu>)
  }

  showLayer(layer){
    let isVsible = layer.getVisible();
    layer.setVisible(!isVsible);
    this.props.layersOnMap();
  }

  layerControlElement(layer){
    return(
      <div className='layers-control-element'>
        <LayersIcon className='layers-control-icon' />
        <p className='layers-control-title'>{layer.getProperties().title}</p>
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
            <div>
              <List>
                {
                  layersOnControl.map((layer, i) => {
                    if(i > 0){
                      return <ListItem key={layersOnControl.indexOf(layer)} primaryText={this.layerControlElement(layer)} leftIcon={<IconButton className='show-layer-button' onClick={this.showLayer.bind(this, layer)}>{layer.getVisible() ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>} rightIcon={this.editLayerMenu(layer)}/>
                    }
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
