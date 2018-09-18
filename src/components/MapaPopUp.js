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

    getDictionary = (dict) => {
        if(dict){
            let arrayDict = Object.entries(dict)
            this.setState({ propertiesPopUp: arrayDict })
        }
    };

    onMapClick = (evt) =>{
        let coordinates = evt.coordinate;
        let popUp = this.state.popUp;
        let pixel = this.props.mapa.getEventPixel(evt.originalEvent);
        let featureProperties = this.props.mapa.forEachFeatureAtPixel(pixel, function(feature, layer) {
            return feature.getProperties();
        })
        if(featureProperties){
            this.getDictionary(featureProperties)
            popUp.setPosition(coordinates)
        } else {
            popUp.setPosition()
        }
    };

    componentDidMount = () => {
        const popUpElement = document.getElementById('mapapopup');
        let popUp = new ol.Overlay({
            element: popUpElement,
            autoPan: true,
        });
        this.setState({ popUp: popUp })
        this.props.mapa.addOverlay(popUp);
    }

    propertyElement = (property) => {
        return(
            <div key={property[0]}>
                <b>{property[0]}</b>
                <p>{property[1]}</p>
            </div>)
    }
    
    render() {  
        return null;
    }
}

export default MapaPopUp;