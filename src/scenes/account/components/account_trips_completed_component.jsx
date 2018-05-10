import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountTripsCompletedScene from './../../../styled_scenes/Account/Trips/Completed';
import { Page, PageContent, PageWrapper } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class AccountTripsCompletedComponent extends Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.props.user_profile){
      if(!this.props.completed_trips.length){
        this.props.fetch_user_trips(this.props.user_profile.objectId, "completed");
      }
    }
  }

  componentWillUpdate(next_props){
    if(this.did_user_props_changed(this.props, next_props)){
      if(!this.props.completed_trips.length){
        if(next_props.user_profile){
          this.props.fetch_user_trips(next_props.user_profile.objectId, "completed");
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
    let ordered_completed_trips = this.props.completed_trips;
    ordered_completed_trips = ordered_completed_trips.sort(function(a,b){
      return new Date(b.endDate.iso) - new Date(a.endDate.iso);
    });
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsCompletedScene
              {...this.props}
              user_profile={this.props.user_profile}
              completed_trips={ordered_completed_trips}
              />
          </PageContent>
        </Page>
      </section>
    )
  }

}

const mapStateToProps = state => {
  return {
    completed_trips: state.AccountReducer.completed_trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountTripsCompletedComponent);
