import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Button, List } from 'semantic-ui-react';

export default class CopyServiceToDayButton extends Component {
  static propTypes = {
    scheduledServices: PropTypes.array.isRequired,
    serviceId: PropTypes.string.isRequired,
    copyServiceToDay: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  /**
   * Checks if the current service exists on `dayIndex`
   */
  isAlreadyInDay = dayIndex => {
    const { scheduledServices, serviceId } = this.props;
    const dayObject = Object.values(scheduledServices).find(({ day }) => day === dayIndex);
    if (!dayObject) return false;
    return dayObject.services.some(service => service.objectId === serviceId);
  };

  renderDay = dayIndex => {
    const { serviceId, copyServiceToDay } = this.props;
    const exists = this.isAlreadyInDay(dayIndex);
    const text = exists ? <i>Day {dayIndex}</i> : `Day ${dayIndex}`;
    return (
      <List.Item
        key={dayIndex}
        disabled={exists}
        onClick={() =>
          copyServiceToDay({ serviceId, day: dayIndex }).then(() =>
            this.setState({ isOpen: false }),
          )
        }
      >
        {text}
      </List.Item>
    );
  };

  renderItems = () => {
    const { scheduledServices } = this.props;
    return Object.values(scheduledServices).map(({ day }) => this.renderDay(day));
  };

  onButtonClick = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  render() {
    return (
      <Popup
        trigger={
          <Button title="Copy service to another day" onClick={this.onButtonClick} icon="copy" />
        }
        on="click"
        open={this.state.isOpen}
        position="left center"
        keepInViewPort
      >
        <Popup.Header>Select a day to copy to</Popup.Header>
        <Popup.Content>
          <List selection verticalAlign="middle" divided>
            {this.renderItems()}
          </List>
        </Popup.Content>
      </Popup>
    );
  }
}
