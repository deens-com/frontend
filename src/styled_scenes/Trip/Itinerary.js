// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
import { getCategory } from 'libs/categories';
import { parseLocation } from 'libs/fetch_helpers';
import { getHeroImage } from 'libs/Utils';

import I18nText from 'shared_components/I18nText';
import { MapMarker } from 'shared_components/icons';
import Category from 'shared_components/Category';
import Tag from 'shared_components/Tag';
import Rating from 'shared_components/Rating';

import mapServicesToDays from './mapServicesToDays';

const Wrapper = styled.div`
  margin: 40px auto 0;
  text-align: center;
  color: #3c434b;
`;

const Title = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
`;

const DayTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
`;

const Day = styled.div`
  margin: 25px 0;
`;

const Service = styled.div`
  margin: 15px 0;
  border: 1px solid #f8f8f8;
  border-radius: 5px;
  text-align: left;
  min-height: 200px;
  position: relative;
  ${media.minSmall} {
    display: flex;
  }
`;

// REMOVE 'display: none;' IT'S JUST A QUICK FIX
const ServiceDescription = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  transition: 0.5s;
  opacity: 0;
  cursor: pointer;
  color: white;
  padding: 15px 10px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
  :hover {
    opacity: 1;
  }
`;

const Image = styled.div`
  display: block;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 200px;
  ${media.minSmall} {
    width: 200px;
  }
`;

const ServiceData = styled.div`
  flex: 1;
  margin: 0 5px;
  padding-bottom: 15px;
  padding-bottom: 45px;
`;

const ServiceTitle = styled.h3`
  font-size: 18px;
  color: #3c434b;
  font-weight: bold;
  margin: 10px 0 5px;
`;

const ServiceTags = styled.div`
  font-size: 12px;
  color: #6e7885;
  > div {
    border-radius: 50px;
  }
`;

const ServiceFooter = styled.div`
  position: absolute;
  bottom: 5px;
`;

const ServicePrice = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #3c434b;
`;

const ServiceLocation = styled.p`
  color: #787878;
  font-size: 12px;
  display: flex;
  svg {
    path: {
      fill: #c4c4c4;
    }
    margin-right: 5px;
  }
`;

const CategoryWrapper = styled.div`
  display: flex;
  margin: 10px 5px 5px;
  align-items: center;
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

const Note = styled.div`
  position: relative;
  color: #c2af4d;
  margin-top: 15px;
  border: 0;
  outline: 0;
  width: 100%;
  background-color: #fffdd9;
  border-radius: 5px;
  padding: 20px 20px;
`;

export default class Itinerary extends Component {
  constructor(props) {
    super(props);
    this.days = mapServicesToDays(props.trip.services, props.trip.duration);
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
      {this.props.trip.notes &&
        this.props.trip.notes[day.day] && (
          <Note>
            <I18nText data={this.props.trip.notes[day.day]} />
          </Note>
        )}
      {day.data.map(dayData => (
        <Service key={dayData.service._id}>
          <ServiceDescription>
            <I18nText data={dayData.service.description} />
          </ServiceDescription>
          {getHeroImage(dayData.service) && (
            <Image url={getHeroImage(dayData.service).files.small.url} />
          )}
          <ServiceData>
            <CategoryWrapper>
              <Category
                color={getCategory(dayData.service.categories[0]).color}
                icon={getCategory(dayData.service.categories[0]).icon}
                name={dayData.service.categories[0].names}
                fontSize="12px"
              />
              {this.renderAvailability(day.day, dayData.service._id)}
            </CategoryWrapper>
            <ServiceTitle>
              <Link to={`/services/${dayData.service._id}`}>
                <I18nText data={dayData.service.title} />
              </Link>
            </ServiceTitle>
            {Boolean(dayData.service.ratings.count) && (
              <Rating
                rating={dayData.service.ratings.average}
                count={dayData.service.ratings.count}
                marginBottom="10px"
              />
            )}
            {dayData.service.tags.length > 0 && (
              <ServiceTags>
                {dayData.service.tags.slice(0, 5).map(tag => (
                  <Tag
                    key={tag.label}
                    item={tag}
                    href={`/results?service_types=trip&tags=${tag.label}`}
                  />
                ))}
              </ServiceTags>
            )}
            <ServiceFooter>
              <ServiceLocation>
                <MapMarker />
                {parseLocation(dayData.service.location)}
              </ServiceLocation>
              {dayData.service.basePrice !== 0 && (
                <ServicePrice>From ${dayData.service.basePrice}</ServicePrice>
              )}
            </ServiceFooter>
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
