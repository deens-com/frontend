import React, { Component } from 'react';
import UserComponent from '../components/UserComponent';
import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
import NotFound from '../../../styled_scenes/NotFound';

export default class UsersContainer extends Component {
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
