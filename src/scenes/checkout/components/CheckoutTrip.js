import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import mapServicesToDays from '../../../styled_scenes/Trip/mapServicesToDays';
import I18nText from 'shared_components/I18nText';

const Day = styled.div`
  color: #3c434b;
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const ItineraryTitle = styled.div`
  text-transform: uppercase;
  color: #c4c4c4;
  text-align: center;
`;

const Service = styled.div`
  border-bottoms: 1px solid #d3d7dc;
  padding-bottom: 20px;
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const ServiceTitle = styled.div`
  font-size: 18px;
`;

export class CheckoutTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: mapServicesToDays(props.trip.services),
    };
  }
  render() {
    const { trip } = this.props;

    return (
      <React.Fragment>
        <ItineraryTitle>Trip Itinerary</ItineraryTitle>
        {this.state.days.map(day => (
          <Day key={day.day}>
            <Title>
              {moment(trip.startDate)
                .add(day.day - 1, 'days')
                .format('LLLL')}
            </Title>
            {day.data.map(service => (
              <Service key={`${day.day}-${service.service._id}`}>
                <ServiceTitle>
                  <I18nText data={service.service.title} />
                </ServiceTitle>
                <Price>${service.service.basePrice}</Price>
              </Service>
            ))}
          </Day>
        ))}
      </React.Fragment>
    );
  }
}

CheckoutTrip.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default CheckoutTrip;
