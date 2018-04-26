import React, { Component } from "react";
import UserComponent from "./../components/user_component";
import * as users_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class UsersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_path: ""
    };
  }

  componentDidMount() {
    const user_id = this.props.location.pathname.split("/")[2];
    this.setState({current_path: this.props.location.pathname.split("/")[3]});
    this.props.fetch_current_user(user_id);
  }

  render() {
    return (
      <div>
        {(() => {
          switch(this.state.current_path) {
            case 'public':
                return null;
            default:
                return null;
          }
        })()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.UsersReducer.user,
    trips: state.UsersReducer.trips,
    given_reviews: state.UsersReducer.given_reviews,
    received_reviews: state.UsersReducer.received_reviews
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(users_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
