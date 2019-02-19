import React, { Component } from 'react';
import UserComponent from '../components/UserComponent';
import axios from 'libs/axios';
import { serverBaseURL } from 'libs/config';
import NotFound from '../../../styled_scenes/NotFound';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.changeHeader();
    const { userName } = this.props.match.params;
    this.fetchUser(userName);
  }

  fetchUser = async username => {
    try {
      const response = await axios.get(`${serverBaseURL}/users/username/${username}`);

      this.setState({
        user: response.data,
      });
    } catch (e) {
      this.setState({
        responseStatus: e.response ? e.response.status : 200,
      });
    }
  };

  render() {
    const { responseStatus, user } = this.state;
    if (responseStatus === 404) {
      return <NotFound />;
    }

    return <UserComponent user={user} />;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(UsersContainer);
