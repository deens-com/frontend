import React, { Component } from 'react';

import AccountTripsScene from '../components/AccountTripsScene';

export default class AccountTripsContainer extends Component {
  render() {
    return <AccountTripsScene {...this.props} />;
  }
}
