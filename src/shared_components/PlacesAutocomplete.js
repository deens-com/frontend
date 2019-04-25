import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { waitUntilMapsLoaded } from 'libs/Utils';

export default class CustomPlacesAutocomplete extends React.Component {
  state = {
    gmapsLoaded: Boolean(window.google && window.google.maps),
  };

  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    });
  };

  componentDidMount() {
    if (!this.state.gmapsLoaded) {
      waitUntilMapsLoaded().then(this.initMap);
    }
  }

  render() {
    return this.state.gmapsLoaded ? <PlacesAutocomplete {...this.props} /> : null;
  }
}
