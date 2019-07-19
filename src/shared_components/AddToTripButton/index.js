import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import Popup from 'shared_components/Popup';

import TripsListInDropDown from './TripsListInDropDown';
import CustomColorSemanticButton from 'shared_components/CustomColorSemanticButton';

// i18n
import { Trans } from '@lingui/macro';

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
    this.props.onTripClick(data);
  };

  onNewTripClickOverride = () => {
    this.handleClose();
    this.props.onNewTripClick();
  };

  render() {
    const { props } = this;

    const addToTripButton = props.customTrigger || (
      <CustomColorSemanticButton
        icon
        labelPosition="right"
        bgColor="rgb(95, 183, 158)"
        whiteText
        onClick={this.handleClose}
      >
        <Trans>Add to trip</Trans>
        <Icon name="angle down" />
      </CustomColorSemanticButton>
    );

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
        trigger={addToTripButton}
        content={listComponent}
        on="click"
        open={this.state.isOpen}
        onOpen={this.handleOpen}
        position="bottom center"
        wide
      />
    );
  }
}
