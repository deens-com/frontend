import React, { Component } from "react";
// import PlacesComponent from "./../components/places_component";
import ServicesComponent from "./../components/services_component";

export default class PlacesContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ServicesComponent {...this.props} />;
  }
}
