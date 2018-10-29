import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import mapServicesToDays from '../../../styled_scenes/Trip/mapServicesToDays';
import I18nText from 'shared_components/I18nText';
import { MapMarker } from 'shared_components/icons';
import { getPriceFromServiceOption } from 'libs/Utils';
import { getCategory } from 'libs/categories';
import Category from 'shared_components/Category';

const Day = styled.div`
  color: #3c434b;
  margin-bottom: 30px;
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
`;
const TripItineraryTitle = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  text-align: center;
  margin: 30px 0;
  line-height: 0.1em;

  > span {
    background: white;
    padding: 0 10px;
  }
`;

const Service = styled.div`
  border-bottom: 1px solid #d3d7dc;
  padding-bottom: 20px;
  margin-top: 20px;
`;

const PriceWrapper = styled.div`
  margin-top: 10px;
  font-size: 14px;
`;

const Price = styled.span`
  font-weight: bold;
`;

const PayAtVenue = styled.div`
  color: #6e7885;
  font-size: 12px;
  background-color: #d3d7dc;
  padding: 5px 15px;
  border-radius: 3px;
  display: inline-block;
  margin-top: 10px;
  font-weight: bold;
`;

const ServiceTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 10px;
`;

const City = styled.div`
  color: #787878;
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  align-items: center;
  > svg {
    path {
      fill: #c4c4c4;
    }
    margin-right: 5px;
  }
`;

function getPrice(trip, day, service) {
  const selected =
    trip.otherAttributes &&
    trip.otherAttributes.selectedServiceOptions &&
    trip.otherAttributes.selectedServiceOptions.find(
      option => option.day === day.day && option.serviceId === service.service._id,
    );

  return selected
    ? getPriceFromServiceOption(service.service.basePrice, selected.price)
    : service.service.basePrice;
}

export class CheckoutTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: mapServicesToDays(props.trip.services, props.trip.duration),
    };
  }

  renderPrice = (trip, day, service) => {
    const price = getPrice(trip, day, service);
    if (
      service.service.periods &&
      service.service.periods[0] &&
      service.service.periods[0].payAtService
    ) {
      return (
        <PriceWrapper>
          <div>
            Average cost: <Price>${price} per person</Price>
          </div>
          <PayAtVenue>Not included in the payment</PayAtVenue>
        </PriceWrapper>
      );
    }
    return (
      <PriceWrapper>
        <Price>
          ${price} for {trip.peopleCount} people
        </Price>
      </PriceWrapper>
    );
  };

  render() {
    const { trip } = this.props;

    return (
      <React.Fragment>
        <TripItineraryTitle>
          <span>Trip Itinerary</span>
        </TripItineraryTitle>
        {this.state.days.map((day, dayIndex) => (
          <Day key={day.day}>
            <Title>
              {moment(trip.startDate)
                .add(day.day - 1, 'days')
                .format('MMM DD, dddd')}
            </Title>
            {day.data.map((service, serviceIndex) => (
              <Service key={`${day.day}-${service.service._id}`}>
                <Category
                  color={getCategory(service.service.categories[0]).color}
                  icon={getCategory(service.service.categories[0]).icon}
                  name={service.service.categories[0].names}
                  fontSize="12px"
                />
                <ServiceTitle>
                  <I18nText data={service.service.title} />
                </ServiceTitle>
                <City>
                  <MapMarker />
                  {service.service.location.formattedAddress}
                </City>
                {this.renderPrice(trip, day, service)}
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
