import React, { Component } from 'react';
import AccountTripsAllScene from './../../../styled_scenes/Account/Trips/All';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class AccountTripsAllComponent extends Component{

  componentDidMount(){
    if(this.props.user_profile){
      this.props.fetch_user_trips(this.props.user_profile.objectId, "all");
    }
  }

  componentWillUpdate(next_props){
    if(this.did_user_props_changed(this.props, next_props)){
      if(!this.props.all_trips.length){
        if(next_props.user_profile){
          this.props.fetch_user_trips(next_props.user_profile.objectId, "all");
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
    let ordered_all_trips = this.props.all_trips;
    ordered_all_trips = ordered_all_trips.sort(function(a,b){
      if (b.endDate && a.endDate) {
        return new Date(b.endDate.iso) - new Date(a.endDate.iso);
      }
    });
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsAllScene
              {...this.props}
              user_profile={this.props.user_profile}
              all_trips={ordered_all_trips}
              />
          </PageContent>
        </Page>
      </section>
    )
  }

}

const mapStateToProps = state => {
  return {
    all_trips: state.AccountReducer.all_trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountTripsAllComponent);
