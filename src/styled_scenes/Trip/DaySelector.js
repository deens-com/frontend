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
    this.days = mapServicesToDays(props.trip.services);
  }

  render() {
    return (
      <Wrapper>
        {this.days.map((day, index) => (
          <Button key={day.title} onClick={() => this.props.goToDay(index)}>
            {day.title}
          </Button>
        ))}
      </Wrapper>
    );
  }
}
export default DaySelector;
