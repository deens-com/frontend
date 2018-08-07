import React, { Component } from 'react';
import AccountTripsPlannedComponent from './account_trips_planned_component';
import AccountTripsCompletedComponent from './account_trips_completed_component';
import AccountTripsAllComponent from './account_trips_all_component';
import * as account_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter } from 'react-router-dom';

class AccountTripsComponent extends Component {
  render() {
    return (
      <div className="AccountTripsComponent">
        <Route
          path={process.env.PUBLIC_URL + '/account/trips/all'}
          render={props => (
            <AccountTripsAllComponent {...this.props} user_profile={this.props.user_profile} />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/trips/planned'}
          render={props => (
            <AccountTripsPlannedComponent {...this.props} user_profile={this.props.user_profile} />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/trips/completed'}
          render={props => (
            <AccountTripsCompletedComponent
              {...this.props}
              user_profile={this.props.user_profile}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user_profile: state.AccountReducer.user_profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AccountTripsComponent),
);
