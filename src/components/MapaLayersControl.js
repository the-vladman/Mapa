import React, { Component } from 'react';
import './MapaLayersControl.css';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';

class MapaLayersControl extends Component {
    render() {
      const layers = this.props.mapa.getLayers();
      return(
      <div className='layers-control-container'>
        <Paper elevation={5}>
            <div id='layers-control-header'>
              <div><h1 id='layers-control-text'>Capas</h1></div>
            </div>
            <div>
              <List>
                <ListItem primaryText="Inbox"/>
                <ListItem primaryText="Inbox"/>
                <ListItem primaryText="Inbox"/>
              </List>
            </div>
        </Paper>
      </div>
      );
    }
}

export default MapaLayersControl;
