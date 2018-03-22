import React, { Component } from "react";
import HomeComponent from "./../components/home_component";
import * as home_actions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class HomeContainer extends Component {
  componentDidMount() {
    this.props.fetch_services();
    this.props.fetch_trips();
  }

  render() {
    return (
      <div className="HomeContainer">
        <HomeComponent
          tags={this.props.tags}
          services={this.props.services}
          trips={this.props.trips}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    services: state.HomeReducer.services,
    tags: state.HomeReducer.tags,
    trips: state.HomeReducer.trips
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(home_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
