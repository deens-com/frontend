import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

import history from 'main/history';
import TripsListInDropDown from './TripsListInDropDown';
import CustomColorSemanticButton from 'shared_components/CustomColorSemanticButton';
import { getSession } from 'libs/user-session';

export default class AddToTripButton extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.daysRef = React.createRef();
    this.state = { isOpen: false };
  }

  static propTypes = {
    myUnpurchasedTrips: PropTypes.array,
    onTripClick: PropTypes.func.isRequired,
    onNewTripClick: PropTypes.func.isRequired,
  };

  handleOpen = () => {
    this.setState({ isOpen: true });
    document.addEventListener('mousedown', this.handleOutsideClick);
  };

  handleOutsideClick = e => {
    if (
      !this.listRef.current.contains(e.target) &&
      (!this.daysRef.current || !this.daysRef.current.contains(e.target))
    ) {
      this.handleClose();
    }
  };

  handleClose = () => {
    this.setState({ isOpen: false });
    document.removeEventListener('mousedown', this.handleOutsideClick);
  };

  onTripClickOverride = trip => {
    this.handleClose();
    this.props.onTripClick(trip);
  };

  onNewTripClickOverride = () => {
    this.handleClose();
    this.props.onNewTripClick();
  };

  isLoggedIn = () => getSession() != null;

  redirectToLogin = () =>
    history.push('/login', {
      from: window.location.pathname,
      message: 'Please login or register to continue',
    });

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
        onClick={isLoggedIn ? this.handleClose : this.redirectToLogin}
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
        innerRef={this.listRef}
        daysRef={this.daysRef}
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
        onOpen={this.handleOpen}
        wide
      />
    );
  }
}
