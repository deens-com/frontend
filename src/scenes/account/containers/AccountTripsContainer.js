import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as accountActions from '../actions';
import AccountTripsScene from '../components/AccountTripsScene';

class AccountTripsContainer extends Component {
  componentDidMount() {
    this.props.fetchUserTrips();
  }

  render() {
    return <AccountTripsScene {...this.props} />;
  }
}

const mapStateToProps = state => ({
  allTrips: state.AccountReducer.allTrips,
});

const mapDispatchToProps = dispatch => bindActionCreators(accountActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountTripsContainer);
