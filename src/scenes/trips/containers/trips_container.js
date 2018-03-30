import React, { Component } from "react";
import TripsComponent from "./../components/trips_component";
import * as trips_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class TripsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch_trips();
  }

  render() {
    return <TripsComponent {...this.props} trips_data={this.props.trips} />;
  }
}

const mapStateToProps = state => {
  return {
    trips: state.TripsReducer.trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(trips_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
