// NPM
import React, { Component } from 'react';
// import moment from 'moment';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { MapMarker, Map, Calendar } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import { minutesToDays } from './mapServicesToDays';
import Tag from 'shared_components/Tag';

const Wrapper = styled.div`
  margin: 40px 20px 0;
  text-align: center;
  color: #3c434b;
  ${media.minMedium} {
    margin: 40px 0 0;
  }
`;

const About = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
`;

const Description = styled.div`
  margin: 20px 0;
  text-align: left;
  ${media.minMedium} {
    text-align: center;
  }
`;

const Tags = styled.div`
  > div {
    border-radius: 50px;
  }
`;

const TripData = styled.div`
  display: flex;
  justify-content: center;
`;

const DataChunk = styled.div`
  display: flex;
  color: #6e7885;
  font-size: 14px;
  font-weight: bold;
  align-items: center;
  margin: 0 10px;
  > svg {
    font-size: 20px;
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
    const { trip, countries, cities } = this.props;

    return (
      <Wrapper>
        <About>About this trip</About>
        <TripData>
          <DataChunk>
            <Calendar />
            <span>{minutesToDays(trip.duration)} Days</span>
          </DataChunk>
          <DataChunk>
            <Map />
            <span>
              {countries} {countries === 1 ? 'Country' : 'Countries'}
            </span>
          </DataChunk>
          <DataChunk>
            <MapMarker />
            <span>
              {cities} {cities === 1 ? 'City' : 'Cities'}
            </span>
          </DataChunk>
        </TripData>
        <Description>
          <I18nText data={trip.description} />
        </Description>
        <Tags>
          {trip.tags.map(tag => (
            <Tag key={tag.label} item={tag} href={`/results?type=trip&tags=${tag.label}`} />
          ))}
        </Tags>
      </Wrapper>
    );
  }
}
