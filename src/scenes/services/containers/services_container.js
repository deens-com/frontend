import React, { Component } from "react";
import PlacesContainer from "./places_container";
import ActivitiesContainer from "./activities_container";
import FoodsContainer from "./foods_container";

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
              return <PlacesContainer {...this.props} />;
            case "activitie":
              return <ActivitiesContainer {...this.props} />;
            case "food":
              return <FoodsContainer {...this.props} />;
            default:
              return null;
          }
        })()}
      </section>
    );
  }
}
