import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import Parse from 'parse';

import history from 'main/history';
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

  isLoggedIn = () => Parse.User.current() != null;

  redirectToLogin = () => history.push('/login');

  render() {
    const { props } = this;

    const isLoggedIn = this.isLoggedIn();
    const clickProps = isLoggedIn ? {} : { onClick: this.redirectToLogin };

    const addToTripButton = (
      <CustomColorSemanticButton
        icon
        labelPosition="right"
        bgColor="rgb(95, 183, 158)"
        whiteText
        {...clickProps}
      >
        Add to trip
        <Icon name="angle down" />
      </CustomColorSemanticButton>
    );

    if (!isLoggedIn) {
      return addToTripButton;
    }

    const listComponent = (
      <TripsListInDropDown
        trips={props.myUnpurchasedTrips}
        onTripClick={this.onTripClickOverride}
        onNewTripClick={this.onNewTripClickOverride}
      />
    );

    return (
      <Popup
        keepInViewPort
        trigger={addToTripButton}
        content={listComponent}
        on="click"
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        wide
      />
    );
  }
}
