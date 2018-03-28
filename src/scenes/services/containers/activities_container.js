import React, { Component } from "react";
import ActivitiesComponent from "./../components/activities_component";

export default class ActivitiesContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ActivitiesComponent {...this.props} />;
  }
}
