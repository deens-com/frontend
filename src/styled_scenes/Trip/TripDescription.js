// NPM
import React, { Component } from 'react';
// import moment from 'moment';
import styled from 'styled-components';

import { MapMarker, Map, Calendar } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import Tag from 'shared_components/Tag';

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

const Tags = styled.div`
  > div {
    border-radius: 50px;
  }
`;

const TripData = styled.div`
  display: flex;
  justify-content: flex-around;
`;

const DataChunk = styled.div`
  display: flex;
  flex: 1;
  color: #6e7885;
  font-size: 12px;
  font-weight: bold;
  > svg {
    fill: #6e7885;
  }
`;

export default class ResultsScene extends Component {
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
    console.log(trip.tags);
    return (
      <Wrapper>
        <About>About this trip</About>
        <TripData>
          <DataChunk>
            <Calendar />
            <span>Days</span>
          </DataChunk>
        </TripData>
        <Description>
          <I18nText data={trip.description} />
        </Description>
        <Tags>
          {trip.tags.map(tag => (
            <Tag
              key={tag.label}
              item={tag}
              href={`/results?service_types=trip&tags=${tag.label}`}
            />
          ))}
        </Tags>
      </Wrapper>
    );
  }
}
