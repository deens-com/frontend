import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Button, List } from 'semantic-ui-react';

export default class CopyServiceToDayButton extends Component {
  static propTypes = {
    scheduledServices: PropTypes.array.isRequired,
    serviceId: PropTypes.string.isRequired,
  };

  renderDay = dayIndex => {
    const { serviceId, copyToDay } = this.props;
    return (
      <List.Item key={dayIndex} onClick={() => copyToDay({ serviceId, dayIndex })}>
        Day {dayIndex}
      </List.Item>
    );
  };

  renderItems = () => {
    const { scheduledServices } = this.props;
    return (
      Object.values(scheduledServices)
        // remove days which already have the service
        .filter(
          ({ services }) =>
            !services.some(singleService => singleService.objectId === this.props.serviceId),
        )
        .map(({ day }) => this.renderDay(day))
    );
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
