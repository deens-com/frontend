import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import mapServicesToDays from '../../../styled_scenes/Trip/mapServicesToDays';
import I18nText from 'shared_components/I18nText';
import MapMarker from 'shared_components/icons/MapMarker';
import { minutesToHoursOrDays, calculateCancellationCharge } from 'libs/trips';
import { getPriceFromServiceOption, getPeopleCount, extractPrice } from 'libs/Utils';
import { getCategory } from 'libs/categories';
import Category from 'shared_components/Category';
import Button from 'shared_components/Button';

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
  display: flex;
`;

const Price = styled.span`
  font-weight: bold;
  flex: 1;
`;

const ServiceTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 10px;
`;

const City = styled.div`
  color: #787878;
  flex: 1;
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

const SecondLine = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  flex-grow: 0;
`;

const CancellationPolicy = styled.div`
  > div {
    margin-bottom: 10px;
  }
`;

const CancellationPolicyTrigger = styled.div`
  color: #097da8;
  font-size: 12px;
  cursor: pointer;
`;

const CancellationHighlight = styled.span`
  color: #097da8;
  font-weight: bolder;
`;

const Policy = styled.div`
  margin-bottom: 15px;
`;

function getPrice(trip, service) {
  return service.selectedOption
    ? getPriceFromServiceOption(
        service.service.basePrice,
        service.selectedOption.price,
        trip.adultCount,
        trip.childrenCount,
      )
    : extractPrice(service.service.basePrice);
}

export class CheckoutTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: mapServicesToDays(props.trip.services, props.trip.duration),
    };
  }

  static defaultProps = {
    showTitle: true,
  };

  renderCancellationPolicy = (policies, price) => {
    if (!policies || policies.length === 0) {
      return <div>Non-refundable</div>;
    }

    return (
      <React.Fragment>
        {policies.map(policy => {
          const time = minutesToHoursOrDays(policy.duration);
          return (
            <Policy>
              If you cancel{' '}
              <CancellationHighlight>
                {time.length} {time.unit}
              </CancellationHighlight>{' '}
              before check-in, you will be charged{' '}
              <CancellationHighlight>
                ${calculateCancellationCharge(policy, price)}
              </CancellationHighlight>{' '}
              of cancellation fee, to be deduced from refund amount.
            </Policy>
          );
        })}
      </React.Fragment>
    );
  };

  renderPrice = (trip, day, service) => {
    const price = getPrice(trip, service);
    if (this.props.onlyExternalServices && service.service.checkoutOptions.payAt !== 'please') {
      return (
        <div>
          Average cost: <Price>${price.toFixed(2)} per person</Price>
        </div>
      );
    }
    return (
      <Price>
        ${price.toFixed(2)} for {getPeopleCount(trip)} people
      </Price>
    );
  };

  render() {
    const { trip, showTitle, onlyExternalServices } = this.props;

    return (
      <React.Fragment>
        {showTitle && (
          <TripItineraryTitle>
            <span>Trip Itinerary</span>
          </TripItineraryTitle>
        )}
        {this.state.days.map((day, dayIndex) => (
          <Day key={day.day}>
            <Title>
              {moment(trip.startDate)
                .add(day.day - 1, 'days')
                .format('MMM DD, dddd')}
            </Title>
            {(onlyExternalServices
              ? day.data.filter(service => service.service.checkoutOptions.payAt !== 'please')
              : day.data
            ).map((service, serviceIndex) => (
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
                <SecondLine>
                  <City>
                    <MapMarker />
                    {service.service.location.formattedAddress ||
                      service.service.location.city ||
                      service.service.location.state}
                  </City>
                  {service.service.checkoutOptions.payAt !== 'please' && (
                    <ButtonWrapper>
                      <Button
                        external
                        type="link"
                        target="_blank"
                        noReferrer
                        href={service.service.checkoutOptions.checkoutURL}
                      >
                        Book here
                      </Button>
                    </ButtonWrapper>
                  )}
                </SecondLine>
                <PriceWrapper>
                  {this.renderPrice(trip, day, service)}
                  <Popup
                    trigger={
                      <CancellationPolicyTrigger>Cancellation policy</CancellationPolicyTrigger>
                    }
                    content={
                      <CancellationPolicy>
                        {service.selectedOption &&
                        service.selectedOption.cancellationPolicies &&
                        service.selectedOption.cancellationPolicies.length > 0
                          ? this.renderCancellationPolicy(
                              service.selectedOption.cancellationPolicies,
                              getPriceFromServiceOption(
                                service.service.basePrice,
                                service.selectedOption.price,
                                trip.adultCount,
                                trip.childrenCount,
                              ),
                            )
                          : this.renderCancellationPolicy(
                              service.service.periods &&
                                service.service.periods[0] &&
                                service.service.periods[0].cancellationPolicies,
                              getPriceFromServiceOption(
                                service.service.basePrice,
                                null,
                                trip.adultCount,
                                trip.childrenCount,
                              ),
                            )}
                      </CancellationPolicy>
                    }
                    position="top center"
                  />
                </PriceWrapper>
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
