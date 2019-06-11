import React, { Component } from 'react';
import AccountProfileComponent from './../components/AccountProfile';
import * as account_actions from 'store/account/actions';
import * as session_actions from 'store/session/actions';
import headerActions from 'store/header/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter } from 'react-router-dom';
import BrandFooter from '../../../shared_components/BrandFooter';
import styled from 'styled-components';
import AccountTripsContainer from './AccountTripsContainer';
import history from 'main/history';

const StaticFooter = styled.footer`
  position: static;
  bottom: 0px;
`;

class AccountContainer extends Component {
  componentDidMount() {
    this.props.getCurrentUser(true);
    this.props.changeHeader();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.session.email && !nextProps.isLoading) {
      history.push('/register');
    }
  }

  render() {
    return (
      <div className="AccountContainer">
        <Route
          path={`${this.props.match.path}/trips`}
          render={props => <AccountTripsContainer {...this.props} user={this.props.session} />}
        />
        <Route
          path={`${this.props.match.path}/profile`}
          render={props => (
            <AccountProfileComponent
              {...this.props}
              user_profile={this.props.session}
              update_user_profile={this.props.update_user_profile}
              editUserError={this.props.updateError}
              update_user_avatar={this.props.update_user_avatar}
              isLoading={this.props.isLoading}
            />
          )}
        />
        {/*<Route
          path={process.env.PUBLIC_URL + '/my/services'}
          render={props => (
            <AccountServicesComponent {...this.props} user_profile={this.props.session} />
          )}
          />*/}
        {/*<Route
          path={`${this.props.match.path}/settings`}
          render={props => (
            <AccountSettingsContainer {...this.props} user_profile={this.props.session} />
          )}
          />*/}
        <StaticFooter>
          <BrandFooter withTopBorder withPadding />
        </StaticFooter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.session.session,
    isUploadingAvatar: state.session.isUploadingAvatar,
    updateError: state.session.updateError,
    isLoading: state.session.isLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { ...account_actions, ...session_actions, changeHeader: headerActions.changeHeader },
    dispatch,
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AccountContainer),
);
