import React, { Component } from 'react';
import AccountTripsUnscheduledScene from './../../../styled_scenes/Account/Trips/Unscheduled';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class AccountTripsUnscheduledComponent extends Component{

  componentDidMount(){
    if(this.props.user_profile){
      this.props.fetch_user_trips(this.props.user_profile.objectId, "unscheduled");
    }
  }

  componentWillUpdate(next_props){
    if(this.did_user_props_changed(this.props, next_props)){
      if(!this.props.unscheduled_trips.length){
        if(next_props.user_profile){
          this.props.fetch_user_trips(next_props.user_profile.objectId, "unscheduled");
        }
      }
    }
  }

  did_user_props_changed = (current_props, next_props) => {
    return (
      current_props.user_profile !== next_props.user_profile
    )
  }

  render(){
    let ordered_unscheduled_trips = this.props.unscheduled_trips;
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsUnscheduledScene
              {...this.props}
              user_profile={this.props.user_profile}
              unscheduled_trips={ordered_unscheduled_trips}
              />
          </PageContent>
        </Page>
      </section>
    )
  }

}

const mapStateToProps = state => {
  return {
    unscheduled_trips: state.AccountReducer.unscheduled_trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountTripsUnscheduledComponent);
