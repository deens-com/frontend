import React, { Component } from "react";
import PlacesComponent from "./../components/places_component";
import ActivitiesComponent from "./../components/activities_component";
import FoodsComponent from "./../components/foods_component";

export default class ServicesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service_type: props.location.pathname.substring(1).slice(0, -1)
    };
  }

  render() {
    return (
      <section>
        {(() => {
          switch (this.state.service_type) {
            case "place":
              return <PlacesComponent {...this.props} />;
            case "activitie":
              return <ActivitiesComponent {...this.props} />;
            case "food":
              return <FoodsComponent {...this.props} />;
            default:
              return null;
          }
        })()}
      </section>
    );
  }
}
