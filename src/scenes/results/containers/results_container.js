import React, { Component } from "react";
import PlacesContainer from "./places_container";
import ActivitiesContainer from "./activities_container";
import FoodsContainer from "./foods_container";

export default class ResultsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    let service_type = this.props.location.search.replace("?type=", "");
    return (
      <section>
        {(() => {
          switch (service_type) {
            case "place":
              return <PlacesContainer {...this.props} service_type="place" />;
            case "activity":
              return (
                <ActivitiesContainer {...this.props} service_type="activity" />
              );
            case "food":
              return <FoodsContainer {...this.props} service_type="food" />;
            default:
              return null;
          }
        })()}
      </section>
    );
  }
}
