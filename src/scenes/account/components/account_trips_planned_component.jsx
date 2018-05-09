import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountTripsPlannedScene from './../../../styled_scenes/Account/Trips/Planned';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class AccountTripsPlannedComponent extends Component{

  constructor(props){
    super(props);
  }

  componentWillUpdate(next_props){
    if(this.did_user_props_changed(this.props, next_props)){
      this.props.fetch_planned_trips(next_props.user_profile.objectId);
    }
  }

  did_user_props_changed = (current_props, next_props) => {
    return (
      current_props.user_profile !== next_props.user_profile
    )
  }

  render(){
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsPlannedScene {...this.props} user_profile={this.props.user_profile} planned_trips={this.props.planned_trips} />
          </PageContent>
        </Page>
      </section>
    )
  }

}

const mapStateToProps = state => {
  return {
    planned_trips: state.AccountReducer.planned_trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountTripsPlannedComponent);
