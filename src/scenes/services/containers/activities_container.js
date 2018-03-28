import React, { Component } from "react";
import ServicesComponent from "./../components/services_component";
import * as services_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ActivitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_activities();
  }

  render() {
    return (
      <ServicesComponent {...this.props} service_data={this.props.activities} />
    );
  }
}

const mapStateToProps = state => {
  return {
    activities: state.ServicesReducer.activities
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(services_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ActivitiesContainer
);
