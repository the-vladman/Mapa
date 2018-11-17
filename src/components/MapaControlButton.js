import React, { Component } from 'react';
import './MapaControlButton.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

class MapaControlButton extends Component {
    render() {
        return (
          <div className='mapa-control-button'>
            <FloatingActionButton mini={true} onClick={this.props.clickButton}>
              <FontIcon className="material-icons">{this.props.icon}</FontIcon>
            </FloatingActionButton>
          </div>
        )
    }
}

export default MapaControlButton;
