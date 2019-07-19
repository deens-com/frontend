import React from 'react';
import { List } from 'semantic-ui-react';

// i18n
import { Trans } from '@lingui/macro';

class SingleTripDropdown extends React.Component {
  render() {
    const dayCount = Math.ceil(this.props.trip.duration / 1440);
    let dayItems = [];
    for (let i = 0; i < dayCount; i++) {
      dayItems.push(
        <List.Item
          key={i}
          onClick={() => this.props.onSelect({ trip: this.props.trip, day: i + 1 })}
        >
          <Trans>Day {i + 1}</Trans>
        </List.Item>,
      );
    }
    return (
      <div ref={this.props.innerRef}>
        <List selection verticalAlign="middle" divided>
          {dayItems}
        </List>
      </div>
    );
  }
}

export default SingleTripDropdown;
