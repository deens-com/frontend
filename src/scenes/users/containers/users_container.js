import React, { Component } from "react";
import UserComponent from "../components/UserComponent";
import * as users_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as selectors from '../selectors';

class UsersContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { userName } = this.props.match.params; 
    this.props.fetchUser(userName);
  }

  render() {
    const { userName } = this.props.match.params; 
    const user = this.props.getUser(userName);
    return <UserComponent user={user} />
  }
}

const mapStateToProps = (state) => {
  return {
    getUser: selectors.getUser(state),
    trips: state.UsersReducer.trips,
    given_reviews: state.UsersReducer.given_reviews,
    received_reviews: state.UsersReducer.received_reviews
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(users_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
