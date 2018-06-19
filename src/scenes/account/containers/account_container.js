import React, { Component } from 'react';
import AccountProfileComponent from './../components/account_profile_component';
import AccountTripsComponent from './../components/account_trips_component';
import AccountServicesComponent from './../components/account_services_component';
import AccountSettingsContainer from './AccountSettingsContainer';
import * as account_actions from './../actions';
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
    this.props.fetch_user_profile();
  }

  render() {
    return (
      <div className="AccountContainer">
        <Route
          path={process.env.PUBLIC_URL + '/account/trips'}
          render={props => <AccountTripsComponent {...props} user_profile={this.props.user_profile} />}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/profile'}
          render={props => (
            <AccountProfileComponent
              {...props}
              user_profile={this.props.user_profile}
              update_user_profile={this.props.update_user_profile}
              editUserError={this.props.editUserError}
            />
          )}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/services'}
          render={props => <AccountServicesComponent {...props} user_profile={this.props.user_profile} />}
        />
        <Route
          path={process.env.PUBLIC_URL + '/account/settings'}
          render={props => <AccountSettingsContainer {...props} user_profile={this.props.user_profile} />}
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
    user_profile: state.AccountReducer.user_profile,
    editUserError: state.AccountReducer.editUserError,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountContainer)
);
