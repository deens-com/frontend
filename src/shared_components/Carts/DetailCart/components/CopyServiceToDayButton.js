import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Button, List } from 'semantic-ui-react';

export default class CopyServiceToDayButton extends Component {
  static propTypes = {
    scheduledServices: PropTypes.array.isRequired,
    serviceId: PropTypes.string.isRequired,
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
    const { serviceId, copyToDay } = this.props;
    const exists = this.isAlreadyInDay(dayIndex);
    const text = exists ? <i>Day {dayIndex}</i> : `Day ${dayIndex}`;
    return (
      <List.Item
        key={dayIndex}
        disabled={exists}
        onClick={() => copyToDay({ serviceId, dayIndex })}
      >
        {text}
      </List.Item>
    );
  };

  renderItems = () => {
    const { scheduledServices } = this.props;
    return Object.values(scheduledServices).map(({ day }) => this.renderDay(day));
  };

  render() {
    return (
      <Popup
        trigger={<Button title="Copy service to another day" icon="copy" />}
        on="click"
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
