import React, { Component } from 'react';
import './MapaLayersControl.css';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Slider from 'material-ui/Slider';

class MapaLayersControl extends Component {
  constructor(props) {
        super(props);
        this.state = {
            layersArray: []
        };
  }

  handleSlider(layer, event, value){
    layer.setOpacity(value)
  }

  deleteLayer(layer){
    this.props.mapa.removeLayer(layer);
    this.setState({
      layersArray: this.props.mapa.getLayers().getArray()
    });
  }

  editLayerMenu(layer){  
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem leftIcon={<FontIcon className="material-icons">color_lens</FontIcon>} />
        <MenuItem primaryText={<Slider onChange={this.handleSlider.bind(this, layer)} style={{ width: '150px', height: '10px' }} />} leftIcon={<FontIcon className="material-icons">tonality</FontIcon>} />
        <Divider />
        <MenuItem onClick={this.deleteLayer.bind(this,layer)} style={{ color: 'red' }} primaryText="Borrar" />
      </IconMenu>)
  }

  componentWillMount() {
    this.setState({
      layersArray: this.props.mapa.getLayers().getArray()
    });
  }

  render() {
    const {layersArray} = this.state;
    return(
      <div className='layers-control-container'>
        <Paper elevation={5}>
            <div id='layers-control-header'>
              <div><h1 id='layers-control-text'>Capas</h1></div>
            </div>
            <div>
              <List>
                {
                  layersArray.map((layer, i) => {
                    if(i > 2){
                      return (<ListItem key={layer.getProperties().id} primaryText={layer.getProperties().title} rightIcon={this.editLayerMenu(layer)} leftIcon={ <FontIcon className="material-icons">layers</FontIcon>} />)
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
