import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TripOrganizer from '../../../styled_scenes/TripOrganizer';

class TripOrganizerContainer extends Component {
  render() {
    return <TripOrganizer />;
  }
}
export default withRouter(TripOrganizerContainer);
