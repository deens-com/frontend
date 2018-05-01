import React, { Component } from "react";
import ProfileComponent from "./../components/profile_component";
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class AccountContainer extends Component {

  componentDidMount() {}

  render() {
    return (
      <div className="AccountContainer">
        <ProfileComponent/>
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
