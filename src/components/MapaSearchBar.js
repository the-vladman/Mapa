import React, { Component } from 'react';
import './MapaSearchBar.css';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

class MapaSearchBar extends Component {
    render() {
        return (
            <div id='search-bar'>
                <div id='search-text'><h1>Agregar Capas</h1></div>
                <div id='search-complex'>
                    <div id='search-input'><TextField fullWidth={true} hintText="Buscar" onChange={this.props.typing}/></div>
                    <div id='search-button'><IconButton onClick={this.props.search} ><SearchIcon /></IconButton></div>
                </div>
            </div>
        )
    }
}

export default MapaSearchBar;