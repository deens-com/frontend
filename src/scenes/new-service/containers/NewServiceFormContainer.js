import React, { Component } from 'react';
import NewServiceForm from '../components/NewServiceForm';

class NewServiceFormContainer extends Component {
  onSubmit = values => {
    console.log('from container onSubmit', values);
  };

  render() {
    return <NewServiceForm onSubmit={this.onSubmit} />;
  }
}

export default NewServiceFormContainer;
