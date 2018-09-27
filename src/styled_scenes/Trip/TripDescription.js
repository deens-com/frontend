// NPM
import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { MapMarker, Map, Calendar } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';

const Wrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  color: #3c434b;
`;

const About = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
`;

const Description = styled.div`
  margin: 20px 0;
`;

export default class ResultsScene extends Component {
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(props, state) {
    return null;
  }

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({ start_date: start, end_date: end });
  };

  render() {
    const { trip } = this.props;

    return (
      <Wrapper>
        <About>About this trip</About>
        <Description>
          <I18nText data={trip.description} />
        </Description>
        {trip.tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </Wrapper>
    );
  }
}
