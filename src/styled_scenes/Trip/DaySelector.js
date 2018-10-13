import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import { media } from 'libs/styled';

import mapServicesToDays from './mapServicesToDays';

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  display: flex;
  bottom: ${props => props.bottom || 0}px;
  background-color: #f2f2f2;
  width: 100%;
  height: 60px;
  align-items: center;
  overflow-x: auto;
  padding: 0 15px;
  > div {
    margin-right: 10px;
  }
  ${media.minMedium} {
    flex-direction: column;
    height: 100vh;
    width: auto;
    padding-top: 250px;
    left: -15px;
    align-items: flex-start;
    justify-content: center;
    background: transparent;
  }
`;

class DaySelector extends React.Component {
  constructor(props) {
    super(props);
    if (props.trips) {
      this.days = mapServicesToDays(props.trip.services, props.trip.duration);
    }
  }

  render() {
    return (
      <Wrapper bottom={this.props.bottom}>
        {(this.props.days || this.days).map((day, index) => (
          <Button
            theme="fillLighterGreen"
            key={day.title}
            onClick={() => this.props.goToDay(index)}
          >
            Day {day.day}
          </Button>
        ))}
        {this.props.onAddDay && (
          <Button theme="fillLighterGreen" onClick={this.props.onAddDay}>
            +
          </Button>
        )}
      </Wrapper>
    );
  }
}
export default DaySelector;
