import React, { Component } from "react";
import AccountProfileComponent from "./../components/account_profile_component";
import AccountTripsComponent from "./../components/account_trips_component";
import AccountServicesComponent from "./../components/account_services_component";
import AccountSettingsComponent from "./../components/account_settings_component";
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route } from "react-router-dom";

class AccountContainer extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.fetch_user_profile();
  }

  render() {
    return (
      <div className="AccountContainer">
        <Route
          path={process.env.PUBLIC_URL + "/account/trips"}
          render={(props)=><AccountTripsComponent {...props} user_profile={this.props.user_profile} />}
        />
        <Route
          path={process.env.PUBLIC_URL + "/account/profile"}
          component={AccountProfileComponent}
        />
        <Route
          path={process.env.PUBLIC_URL + "/account/services"}
          component={AccountServicesComponent}
        />
        <Route
          path={process.env.PUBLIC_URL + "/account/settings"}
          component={AccountSettingsComponent}
        />
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    user_profile: state.AccountReducer.user_profile
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
