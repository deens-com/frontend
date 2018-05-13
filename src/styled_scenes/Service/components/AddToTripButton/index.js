import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import Button from '../../../../shared_components/Button';
import TripsListInDropDown from './TripsListInDropDown';

export default class AddToTripButton extends React.Component {
  static propTypes = {
    trips: PropTypes.array,
    onTripClick: PropTypes.func.isRequired,
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
    this.setState({ isOpen: false });
    this.props.onTripClick(trip);
  };

  render() {
    const { props } = this;
    const addToTripButton = (
      <Button type="button" round size="small" iconAfter="arrowDown" theme="mainFilled" text="Add to trip" />
    );
    const listComponent = <TripsListInDropDown trips={props.trips} onTripClick={this.onTripClickOverride} />;

    return (
      <Popup
        trigger={addToTripButton}
        content={listComponent}
        on="click"
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        position="bottom right"
        hideOnScroll
      />
    );
  }
}
