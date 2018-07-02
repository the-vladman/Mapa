import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import './MapaAddLayersModal.css';
import ol from 'openlayers';
import LinearProgress from 'material-ui/LinearProgress';
import { GridList, GridTile } from 'material-ui/GridList';
import MapaSearchBar from './MapaSearchBar';
import MapaResourceItem from './MapaResourceItem';

class MapaAddLayersModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedModal: false,
            isLoadedLayers:false,
            errorModal: null,
            errorSearch: null,
            layers: [],
            layersSelected: [],
            searchText: '',
        };
    }

    componentWillMount() {
        this.getBestLayers();
    }

    getBestLayers(){
        fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?organization.title!=INEGI')
            .then(res => res.json())
            .then(
                (response) => {
                    this.setState({
                        isLoadedModal: true,
                        layers: response.results
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoadedModal: true,
                        errorModal: error
                    });
                }
            );
    }

    createLayer(layer){
        var newWmsLayer = new ol.layer.Tile({
            title: layer.name_resource ? layer.name_resource : layer.geoserver,
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
        this.getBestLayers();
    }


    changeText(event){
        this.setState({
            searchText: event.target.value,
        });
    }

    searchLayers(){
        this.getLayersSearch(this.state.searchText);
    }

    getLayersSearch(text){
        fetch(process.env.REACT_APP_API_URL + '/ckan-geoserver?name_resource=/(' + text + ')/i')
            .then(res => res.json())
            .then(
                (response) => {
                    this.setState({
                        isLoadedLayers: true,
                        layers: response.results,
                        searchText: ''
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoadedLayers: true,
                        errorSearch: error,
                        searchText: ''
                    });
                }
            );
    }

    addLayers(){

    }


    render() {
        const { errorModal, isLoadedModal, layers, isLoadedLayers, errorSearch } = this.state;
        if (errorModal) {
            return <div>Error: {errorModal.message}</div>;
        } else if (!isLoadedModal) { 
            return < LinearProgress mode = "indeterminate" />;
        } else {
            return (
                <div>
                    <Dialog
                        title={<MapaSearchBar typing={this.changeText.bind(this)} search={this.searchLayers.bind(this)} />}
                        open={this.props.isOpen}
                        onRequestClose={this.props.closeModal}
                        autoScrollBodyContent={true}
                        contentStyle={{ width: '80%', maxWidth: 'none'}}
                >
                    <GridList
                        cellHeight='auto'
                        title='Capas Destacadas'
                    >
                    {
                        layers.map(layer => (
                                <GridTile key={layer._id}>
                                    <MapaResourceItem capa={layer}  selected={this.selectedLayer.bind(this, layer)}></MapaResourceItem>
                                </GridTile>)
                        )
                    }
                    </GridList>
                    </Dialog>
                </div>
            );
        }
    }
}

export default MapaAddLayersModal;