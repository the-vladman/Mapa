import React, { Component } from 'react';
import './MapaResourceItem.css';

class MapaResourceItem extends Component {
    render() {
        const layer = this.props.capa;
        return (
            <div className='resource-item' onClick={this.props.selected}>
                <div className='resource-item-icon'><span className="tag-icon tag-geoespacial"></span></div>
                <div className='resource-item-info'>
                    <div className='resource-item-name'>{layer.name_resource ? layer.name_resource : layer.geoserver}</div>
                    <div className='resource-item-description'>{layer.description}</div>
                </div>
                <div className='resource-item-org'>
                    {
                        layer.organization ?
                            (<strong>
                                <a href={process.env.REACT_APP_CKAN_URL + '/busca/organization/' + layer.organization.name}>{layer.organization ? layer.organization.title : ''}</a>
                            </strong>) :
                            (<strong></strong>)
                    }
                </div>
            </div> 
        )
    }
}

export default MapaResourceItem;