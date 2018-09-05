import React, { Component } from 'react';
import AccountTripsAllScene from './../../../styled_scenes/Account/Trips/All';
import { Page, PageContent } from './../../../shared_components/layout/Page';
import TopBar from '../../../shared_components/TopBarWithSearch';
import * as account_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderArrayByCustomField } from 'libs/Utils';

class AccountTripsAllComponent extends Component {
  state = {
    orderedTrips: [],
  };

  componentDidMount() {
    if (this.props.user_profile) {
      this.props.fetch_user_trips();
    }
  }

  componentWillUpdate(next_props) {
    if (this.did_user_props_changed(this.props, next_props)) {
      if (!this.props.all_trips.length) {
        if (next_props.user_profile) {
          this.props.fetch_user_trips(next_props.user_profile.objectId, 'all');
        }
      }
    }

    if (this.props.all_trips !== next_props.all_trips) {
      // trips have arrived
      this.setState({ orderedTrips: orderArrayByCustomField(next_props.all_trips, 'endDate.iso') });
    }
  }

  did_user_props_changed = (current_props, next_props) => {
    return current_props.user_profile !== next_props.user_profile;
  };

  render() {
    return (
      <section>
        <Page topPush>
          <TopBar fixed withPadding />
          <PageContent padding="24px">
            <AccountTripsAllScene
              {...this.props}
              user_profile={this.props.user_profile}
              all_trips={this.state.orderedTrips}
            />
          </PageContent>
        </Page>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    all_trips: state.AccountReducer.all_trips,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(account_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountTripsAllComponent);
