import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export default class CustomPlacesAutocomplete extends React.Component {
  state = {
    gmapsLoaded: Boolean(window.initMap),
  };

  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    });
  };

  componentDidMount() {
    if (!window.initMap) {
      window.initMap = this.initMap;
      const gmapScriptEl = document.createElement('script');
      gmapScriptEl.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc&libraries=places&language=en&callback=initMap';
      document.querySelector('body').insertAdjacentElement('beforeend', gmapScriptEl);
    }
  }

  render() {
    return this.state.gmapsLoaded ? <PlacesAutocomplete {...this.props} /> : null;
  }
}
