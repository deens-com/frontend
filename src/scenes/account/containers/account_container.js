import React, { Component } from 'react';
import AccountProfileComponent from './../components/account_profile_component';
import AccountTripsComponent from './../components/account_trips_component';
import AccountServicesComponent from './../components/account_services_component';
import AccountSettingsContainer from './AccountSettingsContainer';
import * as account_actions from './../actions';
import * as session_actions from 'scenes/sessions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter } from 'react-router-dom';
import BrandFooter from '../../../shared_components/BrandFooter';
import styled from 'styled-components';

const StaticFooter = styled.footer`
  position: static;
  bottom: 0px;
`;

class AccountContainer extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  render() {
    return (
      <div className="AccountContainer">
        <Route
          path={process.env.PUBLIC_URL + '/account/trips'}
          render={props => (
            <AccountTripsComponent {...this.props} user_profile={this.props.session} />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/profile'}
          render={props => (
            <AccountProfileComponent
              {...this.props}
              user_profile={this.props.session}
              update_user_profile={this.props.update_user_profile}
              editUserError={this.props.updateError}
            />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/services'}
          render={props => (
            <AccountServicesComponent {...this.props} user_profile={this.props.session} />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/settings'}
          render={props => (
            <AccountSettingsContainer {...this.props} user_profile={this.props.session} />
          )}
        />
        <StaticFooter>
          <BrandFooter withTopBorder withPadding />
        </StaticFooter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    updateError: state.SessionsReducer.updateError,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...account_actions, ...session_actions}, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AccountContainer),
);
