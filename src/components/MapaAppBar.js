import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Measure from '@boundlessgeo/sdk/components/Measure';
import Navigation from '@boundlessgeo/sdk/components/Navigation';

class MapaAppBar extends Component {
    render() {
        return(
            <AppBar
            style={{ 'z-index': 0, }}
            iconElementLeft={
                <div>
                    <Navigation toggleGroup='navigation' secondary={true} />
                    <Measure toggleGroup='navigation' map={this.props.mapa} />
                </div>
            }/>
        );
    }
}

export default MapaAppBar;