import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';

import mapServicesToDays from './mapServicesToDays';

const Wrapper = styled.div`
  position: fixed;
  left: -15px;
  z-index: 100;
  height: 100vw;
  padding-top: 250px;
  display: flex;
  flex-direction: column;
`;

class DaySelector extends React.Component {
  constructor(props) {
    super(props);
    if (props.trips) {
      this.days = mapServicesToDays(props.trip.services);
    }
  }

  render() {
    return (
      <Wrapper>
        {(this.props.days || this.days).map((day, index) => (
          <Button key={day.title} onClick={() => this.props.goToDay(index)}>
            {day.title}
          </Button>
        ))}
        {this.props.onAddDay && <Button onClick={this.props.onAddDay}>+</Button>}
      </Wrapper>
    );
  }
}
export default DaySelector;
