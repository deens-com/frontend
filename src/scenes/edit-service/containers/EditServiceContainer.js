import React, { Component } from 'react';
import EditServiceScene from '../components/EditServiceScene';

class EditServiceContainer extends Component {
  render() {
    return <EditServiceScene id={this.props.match.params.id}/>;
  }
}

export default EditServiceContainer;
