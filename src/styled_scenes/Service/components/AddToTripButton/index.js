import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import Button from '../../../../shared_components/Button';
import TripsListInDropDown from './TripsListInDropDown';

const AdddToTripButton = props => {
  const addToTripButton = (
    <Button type="button" round size="small" iconAfter="arrowDown" theme="mainFilled" text="Add to trip" />
  );
  const listComponent = <TripsListInDropDown trips={props.trips} />;

  return <Popup trigger={addToTripButton} content={listComponent} on="click" position="bottom right" hideOnScroll />;
};

AdddToTripButton.propTypes = {
  trips: PropTypes.array,
};

export default AdddToTripButton;
