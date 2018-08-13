import React, { Component } from 'react';
import AccountTripsPlannedScene from './../../../styled_scenes/Account/Trips/Planned';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { comparatorWithNullValues } from '../../../libs/Utils';

class AccountTripsPlannedComponent extends Component {
  componentDidMount() {
    if (this.props.user_profile) {
      this.props.fetch_user_trips(this.props.user_profile.objectId, 'planned');
    }
  }

  componentWillUpdate(next_props) {
    if (this.did_user_props_changed(this.props, next_props)) {
      if (!this.props.planned_trips.length) {
        if (next_props.user_profile) {
          this.props.fetch_user_trips(next_props.user_profile.objectId, 'planned');
        }
      }
    }
  }

  did_user_props_changed = (current_props, next_props) => {
    return current_props.user_profile !== next_props.user_profile;
  };

  render() {
    let ordered_planned_trips = this.props.planned_trips;
    ordered_planned_trips = ordered_planned_trips.sort((a, b) => {
      const aValue = a && a.beginDate && a.beginDate.iso && new Date(a.beginDate.iso);
      const bValue = b && b.beginDate && b.beginDate.iso && new Date(b.beginDate.iso);
      return comparatorWithNullValues(aValue, bValue);
    });
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsPlannedScene
              {...this.props}
              user_profile={this.props.user_profile}
              planned_trips={ordered_planned_trips}
            />
          </PageContent>
        </Page>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    planned_trips: state.AccountReducer.planned_trips,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountTripsPlannedComponent);
