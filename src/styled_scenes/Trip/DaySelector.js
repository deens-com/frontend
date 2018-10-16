import React from 'react';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import { media } from 'libs/styled';

import mapServicesToDays from './mapServicesToDays';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1;
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
  ${media.minLarge} {
    flex-direction: column;
    max-height: calc(100vh - 80px);
    height: auto;
    bottom: 0;
    width: auto;
    left: -18px;
    padding: 0;
    top: 80px;
    align-items: flex-start;
    background: transparent;
    > div {
      margin-bottom: 10px;
      margin-right: 0;
    }
  }
`;

class DaySelector extends React.Component {
  constructor(props) {
    super(props);
    if (props.trip) {
      this.days = mapServicesToDays(props.trip.services, props.trip.duration);
    }
  }

  render() {
    const days = this.props.days || this.days;
    return (
      <Wrapper bottom={this.props.bottom}>
        {days.map((day, index) => (
          <Button
            theme="fillLighterGreen"
            key={day.title}
            onClick={() => this.props.goToDay(index)}
            bold
            size="medium"
          >
            {day.shortTitle}
          </Button>
        ))}
        {this.props.onAddDay && (
          <Button bold fontSize="22px" theme="fillLighterGreen" onClick={this.props.onAddDay}>
            +
          </Button>
        )}
      </Wrapper>
    );
  }
}
export default DaySelector;
