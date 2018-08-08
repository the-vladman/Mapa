import React, { Component } from 'react';
import './MapaLayersControl.css';
import ol from 'openlayers';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Slider from 'material-ui/Slider';
import { SliderPicker } from 'react-color';

class MapaLayersControl extends Component {
  constructor(props) {
        super(props);
  }

  handleSlider(layer, event, value){
    layer.setOpacity(value);
  }

  handleChangeColor(layer, color, event){
    const newStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: color.hex }),
      stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
    });
    layer.setStyle(newStyle);
  }

  deleteLayer(layer){
    this.props.mapa.removeLayer(layer);
    this.props.layersOnMap();
  }

  editLayerMenu(layer){
    console.log(layer);
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText={<SliderPicker onChange={ this.handleChangeColor.bind(this, layer) } />} leftIcon={<FontIcon className="material-icons">color_lens</FontIcon>} />
        <MenuItem primaryText={<Slider onChange={this.handleSlider.bind(this, layer)} style={{ width: '180px', height: '10px' }} />} leftIcon={<FontIcon className="material-icons">tonality</FontIcon>} />
        <Divider />
        <MenuItem onClick={this.deleteLayer.bind(this,layer)} style={{ color: 'red' }} primaryText="Borrar" />
      </IconMenu>)
  }

  componentDidMount() {
  }

  render() {
    let {layersOnControl} = this.props
    return(
      <div className='layers-control-container'>
        <Paper elevation={5}>
            <div id='layers-control-header'>
              <h1 id='layers-control-text'>Capas</h1>
            </div>
            <div>
              <List>
                {
                  layersOnControl.map((layer, i) => {
                    if(i > 0){
                      return (<ListItem key={layersOnControl.indexOf(layer)} primaryText={layer.getProperties().title} rightIcon={this.editLayerMenu(layer)} leftIcon={ <FontIcon className="material-icons">layers</FontIcon>} />)
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
