import React, { Component } from "react";
import PlacesContainer from "./places_container";
import ActivitiesContainer from "./activities_container";
import FoodsContainer from "./foods_container";

export default class ServicesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service_type: props.location.pathname.substring(1)
    };
  }

  render() {
    return (
      <section>
        {(() => {
          switch (this.state.service_type) {
            case "places":
              return <PlacesContainer {...this.props} service_type="place" />;
            case "activities":
              return (
                <ActivitiesContainer {...this.props} service_type="activity" />
              );
            case "foods":
              return <FoodsContainer {...this.props} service_type="food" />;
            default:
              return null;
          }
        })()}
      </section>
    );
  }
}
