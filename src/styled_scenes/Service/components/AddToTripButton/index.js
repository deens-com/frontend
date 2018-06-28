import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

import TripsListInDropDown from './TripsListInDropDown';
import CustomColorSemanticButton from 'shared_components/CustomColorSemanticButton';

export default class AddToTripButton extends React.Component {
  static propTypes = {
    myUnpurchasedTrips: PropTypes.array,
    onTripClick: PropTypes.func.isRequired,
    onNewTripClick: PropTypes.func.isRequired,
  };

  state = { isOpen: false };

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  onTripClickOverride = trip => {
    // close the popup
    this.handleClose();
    this.props.onTripClick(trip);
  };

  onNewTripClickOverride = () => {
    // close the popup
    this.handleClose();
    this.props.onNewTripClick();
  };

  render() {
    const { props } = this;
    const addToTripButton = (
      <CustomColorSemanticButton icon labelPosition="right" bgColor="rgb(95, 183, 158)" whiteText>
        Add to trip
        <Icon name="angle down" />
      </CustomColorSemanticButton>
    );
    const listComponent = (
      <TripsListInDropDown
        trips={props.myUnpurchasedTrips}
        onTripClick={this.onTripClickOverride}
        onNewTripClick={this.onNewTripClickOverride}
      />
    );

    return (
      <Popup
        trigger={addToTripButton}
        content={listComponent}
        on="click"
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        position="bottom right"
      />
    );
  }
}
