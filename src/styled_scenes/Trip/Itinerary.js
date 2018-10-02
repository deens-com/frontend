// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import I18nText from 'shared_components/I18nText';

import mapServicesToDays from './mapServicesToDays';

const Wrapper = styled.div`
  margin: 40px auto 0;
  text-align: center;
  color: #3c434b;
  max-width: 825px;
`; // Should move max-width to parent

const Title = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
`;

const DayTitle = styled.div`
  font-size: 18px;
`;

const Day = styled.div`
  margin: 25px 0;
`;

const Service = styled.div`
  margin: 15px 0;
  border: 1px solid #f8f8f8;
  border-radius: 5px;
  min-height: 200px;
  display: flex;
`;

const Image = styled.div`
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 200px;
`;

const ServiceData = styled.div`
  flex: 1;
`;

const CategoryWrapper = styled.div`
  display: flex;
  margin: 10px 10px 0;
`;

const Category = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const AvailabilityBox = styled.div`
  flex-shrink: 1;
  display: flex;
  justify-content: flex-end;
  border-radius: 5px;
  padding: 5px;
`;

const CheckingAvailability = AvailabilityBox.extend`
  background-color: #f7f7f7;
  color: #919191;
`;

const Availability = AvailabilityBox.extend`
  background-color: ${props => (props.available ? '#BAFFE8' : '#FFC3C3')};
  color: ${props => (props.available ? '#38D39F' : '#F65353')};
`;

export default class Itinerary extends Component {
  constructor(props) {
    super(props);
    this.days = mapServicesToDays(props.trip.services);
    this.r = this.days.map(_ => React.createRef());
    props.assignRefsToParent(this.r);
  }

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({ start_date: start, end_date: end });
  };

  renderAvailability = (day, id) => {
    if (this.props.isCheckingAvailability) {
      return <CheckingAvailability>Checking availability...</CheckingAvailability>;
    }

    if (!this.props.startDate || !this.props.numberOfPeople || !this.props.availability) {
      return null;
    }

    const thisAvailability =
      this.props.availability &&
      this.props.availability.find(elem => elem.day === day && elem.serviceId === id);
    const isAvailable = thisAvailability && thisAvailability.isAvailable;

    return (
      <Availability available={isAvailable}>
        {isAvailable ? 'Available' : 'Unavailable'}
      </Availability>
    );
  };

  renderDay = (day, index) => (
    <Day key={day.title} innerRef={this.r[index]}>
      <DayTitle>{day.title}</DayTitle>
      {day.data.map(dayData => (
        <Service key={dayData.service._id}>
          {dayData.service.media &&
            dayData.service.media[0] && <Image url={dayData.service.media[0].files.small.url} />}
          <ServiceData>
            <CategoryWrapper>
              <Category>
                <I18nText data={dayData.service.categories[0].names} />
              </Category>
              {this.renderAvailability(day.day, dayData.service._id)}
            </CategoryWrapper>
            <I18nText data={dayData.service.title} />
            <I18nText data={dayData.service.description} />
          </ServiceData>
        </Service>
      ))}
    </Day>
  );

  render() {
    return (
      <Wrapper>
        <Title>Your Itinerary</Title>
        {this.days.map(this.renderDay)}
      </Wrapper>
    );
  }
}

Itinerary.propTypes = {
  trip: PropTypes.object.isRequired,
  availability: PropTypes.array,
  numberOfPeople: PropTypes.number,
  startDate: PropTypes.number,
  assignRefsToParent: PropTypes.func.isRequired,
};
