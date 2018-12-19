import React, { Component } from 'react';
import UserComponent from '../components/UserComponent';
import * as users_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
import NotFound from '../../../styled_scenes/NotFound';

class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { userName } = this.props.match.params;
    this.fetchUser(userName);
  }

  fetchUser = async username => {
    const response = await axios.get(`${serverBaseURL}/users/username/${username}`);

    this.setState({
      user: response.data,
      responseStatus: response.status,
    });
  };

  render() {
    const { responseStatus, user } = this.state;
    if (responseStatus === 404) {
      return <NotFound />;
    }

    return <UserComponent user={user} />;
  }
}

const mapStateToProps = state => {
  return {
    trips: state.UsersReducer.trips,
    given_reviews: state.UsersReducer.given_reviews,
    received_reviews: state.UsersReducer.received_reviews,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(users_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersContainer);
