import React, { Component } from 'react';
import UserComponent from '../components/UserComponent';
import * as users_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as selectors from '../selectors';
import NotFound from '../../../styled_scenes/NotFound';

class UsersContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { userName } = this.props.match.params;
    this.props.fetchFullUser(userName);
  }

  render() {
    const { userFetchError } = this.props;
    if (userFetchError && userFetchError.code === 404) {
      return <NotFound />;
    }
    const { userName } = this.props.match.params;
    const childProps = {
      user: this.props.getUser(userName),
    };
    if (childProps.user) {
      childProps.tripsBooked = this.props.getTripsBooked(childProps.user.objectId);
      childProps.tripsAndServicesOffered = this.props.getTripsAndServicesOffered(childProps.user.objectId);
      childProps.givenReviews = this.props.getGivenReviews(childProps.user.objectId);
      childProps.receivedReviews = this.props.getReceivedReviews(childProps.user.objectId);
    }
    return <UserComponent {...childProps} />;
  }
}

const mapStateToProps = state => {
  return {
    getUser: selectors.getUser(state),
    userFetchError: selectors.getUserFetchError(state),
    getTripsBooked: selectors.getTripsBooked(state),
    getTripsAndServicesOffered: selectors.getTripsAndServicesOffered(state),
    getGivenReviews: selectors.getGivenReviews(state),
    getReceivedReviews: selectors.getReceivedReviews(state),
    trips: state.UsersReducer.trips,
    given_reviews: state.UsersReducer.given_reviews,
    received_reviews: state.UsersReducer.received_reviews,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(users_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
