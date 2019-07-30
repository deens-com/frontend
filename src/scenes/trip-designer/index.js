import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import tripDesignerActions from 'store/trip-designer/actions';
import styled from 'styled-components';
import history from 'main/history';
import { generateTripSlug } from 'libs/Utils';
import headerActions from 'store/header/actions';
import NotFound from 'styled_scenes/NotFound';
import urls from 'libs/urlGenerator';
const Wrapper = styled.div``;

class TripDesigner extends Component {
  componentDidMount() {
    this.props.changeHeader({ noMargin: true, forceNotFixed: true });
    if (this.props.match.params.id) {
      this.props.fetchTrip(this.props.match.params.id).then(() => {
        this.props.checkAvailability();
        this.props.getTransportation();
      });
      return;
    }
    history.replace('/new/trip');
  }

  componentDidUpdate(prevProps) {
    if (this.props.trip && !prevProps.trip) {
      if (this.props.trip && this.props.trip.bookingStatus === 'booked') {
        history.replace(
          urls.trip.view({
            slug: generateTripSlug(this.props.trip),
            id: this.props.trip._id,
          }),
        );
        return;
      }
      if (
        this.props.match.params.id &&
        this.props.trip &&
        this.props.session._id &&
        this.props.trip.owner !== this.props.session._id
      ) {
        history.replace('/');
        return;
      }
    }
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchTrip(this.props.match.params.id).then(() => {
        this.props.checkAvailability();
        this.props.getTransportation();
      });
      return;
    }
  }

  render() {
    if (this.props.error) {
      return <NotFound />;
    }

    return null;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
      checkAvailability: tripDesignerActions.checkAvailability,
      getTransportation: tripDesignerActions.getTransportation,
      fetchTrip: tripDesignerActions.fetchTrip,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(TripDesigner));
