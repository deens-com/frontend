import React, { Component } from "react";
// import ActivitiesComponent from "./../components/activities_component";
import ServicesComponent from "./../components/services_component";

export default class ActivitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ServicesComponent {...this.props} />;
  }
}
