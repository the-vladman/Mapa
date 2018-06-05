import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class MapaAddLayersModal extends Component {
    render() {
        return (
            <div>
                <Dialog
                    title="Dialog With Actions"
                    open={this.props.isOpen}
                    onRequestClose={this.props.closeModal}
                >
                    The actions in this window were passed in as an array of React objects.
                 </Dialog>
            </div>
        );
    }
}

export default MapaAddLayersModal;