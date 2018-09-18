import React, { Component } from 'react';
import './MapaPopUp.css';
import ol from 'openlayers';

class MapaPopUp extends Component {
    constructor(props) {
        super(props);
        props.mapa.on('singleclick', this.onMapClick);
        this.state = {
            propertiesPopUp: [],
            popUp: null
        };
    }

    onMapClick = (evt) =>{
        var pixel = this.props.mapa.getEventPixel(evt.originalEvent);
        this.props.mapa.forEachFeatureAtPixel(pixel, function(feature, layer) {
            console.log('features', feature.getProperties())
        })
    };

    render() {  
        return null;
    }
}

export default MapaPopUp;