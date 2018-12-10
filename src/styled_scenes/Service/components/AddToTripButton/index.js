import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

import history from 'main/history';
import TripsListInDropDown from './TripsListInDropDown';
import SingleTripDropdown from './SingleTripDropdown';
import CustomColorSemanticButton from 'shared_components/CustomColorSemanticButton';

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

  onTripClickOverride = data => {
    this.handleClose();
    this.props.onTripClick(data, this.props.isLoggedIn);
  };

  onNewTripClickOverride = () => {
    this.handleClose();
    this.props.onNewTripClick();
  };

  render() {
    const { props } = this;

    const addToTripButton = (
      <CustomColorSemanticButton
        icon
        labelPosition="right"
        bgColor="rgb(95, 183, 158)"
        whiteText
        onClick={this.handleClose}
      >
        Add to trip
        <Icon name="angle down" />
      </CustomColorSemanticButton>
    );

    const listComponent = props.isLoggedIn ? (
      <TripsListInDropDown
        innerRef={this.listRef}
        daysRef={this.daysRef}
        trips={props.myUnpurchasedTrips}
        onTripClick={this.onTripClickOverride}
        onNewTripClick={this.onNewTripClickOverride}
      />
    ) : (
      <SingleTripDropdown
        innerRef={this.listRef}
        trip={props.myUnpurchasedTrips[0]}
        onSelect={this.onTripClickOverride}
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
