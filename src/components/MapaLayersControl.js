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
    render() {
      const layersArray = this.props.mapa.getLayers().getArray();
      layersArray.map(layer => {
        console.log(layer.getProperties())
      })

      const editLayerMenu = (
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem leftIcon={<FontIcon className="material-icons">color_lens</FontIcon>}/>
          <MenuItem primaryText={<Slider style={{ width: '150px', height:'10px'}}/>} leftIcon={<FontIcon className="material-icons">tonality</FontIcon>}/>
          <Divider />
          <MenuItem style={{ color: 'red' }} primaryText="Borrar" />
        </IconMenu>
      );

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
                    if(i > 0){
                      return (<ListItem key={layer.getProperties().id} primaryText={layer.getProperties().title} rightIcon={editLayerMenu} leftIcon={ <FontIcon className="material-icons">layers</FontIcon>} />)
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
