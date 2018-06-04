import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Measure from '@boundlessgeo/sdk/components/Measure';
import Navigation from '@boundlessgeo/sdk/components/Navigation';

class MapaAppBar extends Component {
    render() {
        return(
            <AppBar
            iconElementLeft={
                <div>
                    <Navigation toggleGroup='navigation' secondary={true} />
                    {/* <Measure toggleGroup='navigation' map={map} /> */}
                </div>
            }/>
        );
    }
}

export default MapaAppBar; // Don’t forget to use export default!