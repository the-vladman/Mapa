import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import './MapaAddLayersModal.css';
import ol from 'openlayers';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';


class MapaAddLayersModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            layers: [],
            layersSelected: []
        };
    }

    componentWillMount() {
        fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver' + '?pageSize=500')
            .then(res => res.json())
            .then(
                (response) => {
                    this.setState({
                        isLoaded: true,
                        layers: response.results
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    createLayer(layer){
        var newWmsLayer = new ol.layer.Tile({
            title: layer.name_resource,
            source: new ol.source.TileWMS({
            url: process.env.REACT_APP_GEOSERVER_URL + '/ows',
            params: {'LAYERS': "ckan:" + layer.geoserver, 'TILED': true},
            serverType: 'geoserver'
            })
        });

        return newWmsLayer;
    }

    selectedLayer(layer) {
        const newLayer = this.createLayer(layer);
        this.props.mapa.addLayer(newLayer);
        this.props.closeModal();
    }


    addLayers(){

    }


    render() {
        const { error, isLoaded, layers } = this.state;
        const actions = [
            <FlatButton
                label="Cancelar"
                onClick={this.props.closeModal}
            />,
            <RaisedButton
                label="Agregar Capas"
                onClick={this.props.closeModal}
            />,
        ];

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return < LinearProgress mode = "indeterminate" />;
        } else {
            return (
                <div>
                    <Dialog
                        title="Agregar Capas"
                        open={this.props.isOpen}
                        onRequestClose={this.props.closeModal}
                        autoScrollBodyContent={true}
                    >
                        <TextField fullWidth={true} hintText="Buscar" /><IconButton><SearchIcon/></IconButton>
                    {
                        layers.map(layer => (
                                <div key={layer._id} className='resource-item' onClick={this.selectedLayer.bind(this, layer)}>
                                    <div className='resource-item-icon'><span className="tag-icon tag-desarrollo"></span></div>
                                    <div className='resource-item-name'>{layer.name_resource ? layer.name_resource : layer.geoserver}</div>
                                    <div className='resource-item-org'>
                                        {
                                            layer.organization ?
                                            (<strong>
                                                <a href={ process.env.REACT_APP_CKAN_URL + '/busca/organization/'+ layer.organization.name}>{layer.organization ? layer.organization.title : ''}</a>
                                            </strong>):
                                            (<strong></strong>)
                                        }
                                    </div>
                                </div>))
                    }
                    </Dialog>
                </div>
            );
        }
    }
}

export default MapaAddLayersModal;