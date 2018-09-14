import React from 'react';
import PropTypes from 'prop-types';
import I18nText from './I18nText';

/**
 * A really small component that takes a location object
 * and prints out `City, Country`
 */
function CityCountry({ location }) {
  return (
    <React.Fragment>
      {location.city}, <I18nText data={location.country.names} />
    </React.Fragment>
  );
}

CityCountry.propTypes = {
  location: PropTypes.object.isRequired,
};

export default CityCountry;
