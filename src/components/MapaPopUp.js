import React, { Component } from 'react';
import './MapaPopUp.css';
import ol from 'openlayers';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

class MapaPopUp extends Component {
    constructor(props) {
        super(props);
        props.mapa.on('singleclick', this.onMapClick);
        this.state = {
            propertiesPopUp: [],
            popUp: null,
            layer: null
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
            if (layer.getProperties().title){
                return feature.getProperties();
            }
            return null;
        })
        let layerProperties = this.props.mapa.forEachFeatureAtPixel(pixel, function (feature, layer) {
            if (layer.getProperties().title){
                return layer.getProperties();
            }
            return null;
        })
        this.setState({ layer:layerProperties })
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
            <TableRow key={property[0]}>
                <TableRowColumn className='row-column'>{property[0]}</TableRowColumn>
                <TableRowColumn className='row-column'>{property[1]}</TableRowColumn>
            </TableRow>)
    }

    render() {
        const { layer, propertiesPopUp } = this.state;
        return(
        <div id="mapapopup" className="ol-popup">
          <div id="popup-content">
              <h5>{layer ? layer.title : ''}</h5>
              <Table height={300}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Parametro</TableHeaderColumn>
                        <TableHeaderColumn>Valor</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                      {
                        propertiesPopUp.map(property => {
                         return property[0] !== 'geometry' ? this.propertyElement(property) : null
                        })
                      }
                  </TableBody>
                </Table>
          </div>
        </div>)
    }
}

export default MapaPopUp;
