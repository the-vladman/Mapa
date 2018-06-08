import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';


class MapaAddLayersModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            layers: []
        };
    }

    componentDidMount() {
        fetch('http://10.20.55.7/v2/api/buda/ckan-geoserver')
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

        const style = {
            height: 50,
            width: 700,
            margin: 10,
            textAlign: 'center',
            display: 'inline-block',
        };

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <Dialog
                        title="Agregar Capas"
                        open={this.props.isOpen}
                        actions={actions}
                        onRequestClose={this.props.closeModal}
                        autoScrollBodyContent={true}
                    >
                    {
                        layers.map(layer => (
                                    <Paper style={style} zDepth={1}> {layer.name_resource} {layer.ckan} </Paper>
                        ))
                    }
                    </Dialog>
                </div>
            );
        }
    }
}

export default MapaAddLayersModal;