import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import mapServicesToDays from '../../../styled_scenes/Trip/mapServicesToDays';
import I18nText from 'shared_components/I18nText';
import MapMarker from 'shared_components/icons/MapMarker';
import { minutesToHoursOrDays, calculateCancellationReturn } from 'libs/trips';
import { getPriceFromServiceOption, getPeopleCount, extractPrice } from 'libs/Utils';
import { getFirstCategoryLowerCase } from 'libs/categories';
import { H1, H2, H4, PStrong, P } from 'libs/commonStyles';
import { media } from 'libs/styled';
import FastBooking from 'shared_components/FastBooking';
import ServiceIcon from 'shared_components/ServiceIcon';
import ServiceOptions from 'shared_components/ServiceOptions';
import { Checkbox } from 'semantic-ui-react';

// i18n
import { Trans } from '@lingui/macro';
import { backgroundDark, tertiary } from 'libs/colors';
import Button from 'shared_components/Button';
import Note from './Note';

const Day = styled.div`
  color: #3c434b;
  margin-bottom: 30px;
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Price = styled.span`
  font-weight: bold;
  flex: 1;
`;

const CancellationHighlight = styled.span`
  color: #097da8;
  font-weight: bolder;
`;

const Policy = styled.div`
  margin-bottom: 15px;
`;

const Table = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  ${media.minMedium} {
    border: 1px solid ${backgroundDark};
    border-bottom: 0;
  }
`;

const Header = styled.div`
  display: none;
  ${media.minMedium} {
    display: flex;
    text-align: center;
    background-color: ${backgroundDark};
    font-size: 16px;
    > div {
      padding: 10px 0;
      border-left: 1px solid white;
    }
  }
`;

const Row = styled.div`
  display: flex;
  min-height: 40px;
  border: 1px solid ${backgroundDark};
  margin-bottom: 15px;
  ${media.minMedium} {
    border: 0;
    border-bottom: 1px solid ${backgroundDark};
    margin-bottom: 0;
  }
`;

const Type = styled.div`
  border-left: 0 !important;
  display: none;
  ${media.minMedium} {
    width: 50px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Name = styled.div`
  display: none;
  ${media.minMedium} {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;

const Dates = styled.div`
  display: none;
  ${media.minMedium} {
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100px;
  }
`;

const Options = styled.div`
  display: none;
  ${media.minMedium} {
    width: 200px;
    text-align: center;
  }
`;

const Cancellation = styled.div`
  display: none;
  ${media.minMedium} {
    display: block;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PriceColumn = styled.div`
  display: none;
  ${media.minMedium} {
    display: block;
    width: 100px;
    text-align: right;
    padding-right: 5px !important;
    text-align: right !important;
  }
`;

const BorderLine = styled.div`
  display: none;
  ${media.minMedium} {
    height: 1px;
    width: 100%;
    background-color: ${backgroundDark};
  }
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
`;

const ApproximatePrice = styled.div`
  display: none;
  ${media.minMedium} {
    width: 140px;
    padding-right: 5px !important;
    text-align: right !important;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;
const BookingInfo = styled.div`
  display: none;
  ${media.minMedium} {
    width: 170px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
`;

const Status = styled.div`
  display: none;
  ${media.minMedium} {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Notes = styled.div`
  display: none;
  ${media.minMedium} {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const LeftColumn = styled.div`
  flex: 1;
  padding: 10px;
  ${media.minMedium} {
    display: none;
  }
`;

const RightColumn = styled.div`
  border-left: 1px solid ${backgroundDark};
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${media.minMedium} {
    display: none;
  }
`;

function getPrice(trip, service, selectedOption, firstDayOfService, lastDayOfService) {
  return (
    (selectedOption
      ? getPriceFromServiceOption(
          service.basePrice,
          selectedOption.price,
          trip.adultCount,
          trip.childrenCount,
        )
      : extractPrice(service.basePrice)) *
    (lastDayOfService - firstDayOfService + 1)
  );
}

export class CheckoutTrip extends React.Component {
  constructor(props) {
    super(props);
    const [bookableServices, externalServices, externalTotalPrice] = this.getFoldedServices();

    this.state = {
      bookableServices,
      externalServices,
      externalTotalPrice,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedOptions !== this.props.selectedOptions) {
      const [bookableServices, externalServices, externalTotalPrice] = this.getFoldedServices();

      this.setState({
        bookableServices,
        externalServices,
        externalTotalPrice,
      });
    }
  }

  getFoldedServices = () => {
    const { services, inDayServices } = this.props;
    let externalTotalPrice = 0;
    let [bookableServices, externalServices] = [{}, {}];
    for (let serviceOrgId of this.props.trip.services) {
      const dayService = inDayServices[serviceOrgId];
      const service = services[dayService.service];
      const belongsTo =
        service.checkoutOptions.payAt === 'please' ? bookableServices : externalServices;
      externalTotalPrice =
        service.checkoutOptions.payAt === 'please'
          ? externalTotalPrice
          : externalTotalPrice + Number(extractPrice(service.basePrice));

      if (belongsTo[service._id]) {
        const currentGroupIndex = belongsTo[service._id].findIndex(
          group => group.lastDay === dayService.day - 1,
        );

        if (currentGroupIndex !== -1) {
          belongsTo[service._id][currentGroupIndex].lastDay = dayService.day;
        } else {
          belongsTo[service._id].push({
            firstDay: dayService.day,
            lastDay: dayService.day,
            selectedOption: dayService.selectedOption,
            serviceOrgId: dayService._id,
          });
        }
      } else {
        belongsTo[service._id] = [
          {
            firstDay: dayService.day,
            lastDay: dayService.day,
            selectedOption: dayService.selectedOption,
            serviceOrgId: dayService._id,
          },
        ];
      }
    }

    const bookableServicesArray = Object.keys(bookableServices).reduce(
      (prevArr, serviceId) => [
        ...prevArr,
        ...bookableServices[serviceId].map(elem => ({ ...elem, service: serviceId })),
      ],
      [],
    );
    const externalServicesArray = Object.keys(externalServices).reduce(
      (prevArr, serviceId) => [
        ...prevArr,
        ...externalServices[serviceId].map(elem => ({ ...elem, service: serviceId })),
      ],
      [],
    );

    const sortByDays = (a, b) => {
      if (a.firstDay > b.firstDay) {
        return 1;
      }
      if (a.firstDay < b.firstDay) {
        return -1;
      }
      if (a.lastDay < b.lastDay) {
        return -1;
      }
      return 1;
    };
    return [
      bookableServicesArray.sort(sortByDays),
      externalServicesArray.sort(sortByDays),
      externalTotalPrice,
    ];
  };

  static defaultProps = {
    showTitle: true,
  };

  renderCancellationPolicy = (selectedOption, service, firstDayOfService, lastDayOfService) => {
    const price = getPrice(
      this.props.trip,
      service,
      selectedOption,
      firstDayOfService,
      lastDayOfService,
    );
    const policies = selectedOption && selectedOption.cancellationPolicies;
    const isCancellable = selectedOption && selectedOption.cancellable;

    if (!policies || !isCancellable || policies.length === 0) {
      return (
        <div>
          <Trans>Non Refundable</Trans>
        </div>
      );
    }

    const dateOfService = moment(this.props.trip.startDate).add(firstDayOfService - 1, 'days');
    let isAnyPolicyOk = false;
    return (
      <React.Fragment>
        {policies.map((policy, i) => {
          const returnAmount = calculateCancellationReturn(policy, Number(price));
          if (!Boolean(Number(returnAmount))) {
            if (i + 1 < policies.length || isAnyPolicyOk) {
              return null;
            }
            return (
              <div>
                <Trans>Non Refundable</Trans>
              </div>
            );
          }
          isAnyPolicyOk = true;
          const time = minutesToHoursOrDays(policy.duration);
          const cancelBefore =
            time.unit === 'days' ? dateOfService.subtract(time.length, 'days') : dateOfService;
          return (
            <Policy>
              <Trans>
                Cancel before{' '}
                <CancellationHighlight>{cancelBefore.format('MMM DD')}</CancellationHighlight> and
                get <CancellationHighlight>${returnAmount}</CancellationHighlight> back.
              </Trans>
            </Policy>
          );
        })}
      </React.Fragment>
    );
  };

  renderPrice = (selectedOption, service, firstDayOfService, lastDayOfService) => {
    const price = getPrice(
      this.props.trip,
      service,
      selectedOption,
      firstDayOfService,
      lastDayOfService,
    );

    return (
      <Price>
        <Trans>${price.toFixed(2)}</Trans>
      </Price>
    );
  };

  renderStatusCheckbox = (serviceOrgId, serviceId) => {
    const { inDayServices } = this.props;
    return (
      <Checkbox
        checked={Boolean(inDayServices[serviceOrgId].externallyBooked)}
        onChange={e => {
          this.props.markAsBooked(
            serviceId,
            serviceOrgId,
            !inDayServices[serviceOrgId].externallyBooked,
          );
        }}
      />
    );
  };

  render() {
    const { trip, inDayServices, services, selectedOptions, availabilities } = this.props;
    const { externalServices, bookableServices, externalTotalPrice } = this.state;

    return (
      <React.Fragment>
        <H1 style={{ textAlign: 'center', marginBottom: '20px' }}>Book your Trip</H1>
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <H2 style={{ marginRight: '10px', marginBottom: '10px' }}>Book with us</H2>
          <FastBooking />
        </div>
        <Table>
          <Header>
            <Type style={{ fontSize: 16 }}>
              <Trans>Type</Trans>
            </Type>
            <Name style={{ justifyContent: 'center' }}>
              <Trans>Name</Trans>
            </Name>
            <Dates>
              <Trans>Dates</Trans>
            </Dates>
            <Options>
              <Trans>Options</Trans>
            </Options>
            <Cancellation>
              <Trans>Cancellation Policy</Trans>
            </Cancellation>
            <PriceColumn>
              <Trans>Price</Trans>
            </PriceColumn>
          </Header>
          {bookableServices.map(serv => {
            const options =
              availabilities &&
              availabilities[serv.serviceOrgId] &&
              availabilities[serv.serviceOrgId].groupedOptions &&
              availabilities[serv.serviceOrgId].groupedOptions.options;
            const inDayService = {
              ...inDayServices[serv.serviceOrgId],
              service: services[serv.service],
            };
            const typeOfService = getFirstCategoryLowerCase(services[serv.service].categories);
            const startDate = moment(this.props.trip.startDate).add(serv.firstDay - 1, 'days');
            const endDate = moment(this.props.trip.startDate).add(
              typeOfService === 'accommodation' ? serv.lastDay : serv.lastDay - 1,
              'days',
            );

            return (
              <>
                <Row key={`${serv.service}-${serv.firstDay}`}>
                  <Type>
                    <ServiceIcon type={typeOfService} />
                  </Type>
                  <Name>{services[serv.service].title}</Name>
                  <Dates>
                    {startDate.format('MMM DD')}
                    {!startDate.isSame(endDate, 'day') && (
                      <>
                        <br />
                        {endDate.format('MMM DD')}
                      </>
                    )}
                  </Dates>
                  <Options>
                    {serv.selectedOption &&
                      selectedOptions[serv.selectedOption] && (
                        <>
                          <I18nText data={selectedOptions[serv.selectedOption].title} />
                          {options && (
                            <ServiceOptions
                              selectOption={this.props.selectOption}
                              options={options}
                              serviceData={inDayService}
                              trip={this.props.trip}
                            />
                          )}
                        </>
                      )}
                  </Options>
                  <Cancellation>
                    {this.renderCancellationPolicy(
                      selectedOptions[serv.selectedOption],
                      services[serv.service],
                      serv.firstDay,
                      serv.lastDay,
                    )}
                  </Cancellation>
                  <PriceColumn>
                    {this.renderPrice(
                      selectedOptions[serv.selectedOption],
                      services[serv.service],
                      serv.firstDay,
                      serv.lastDay,
                    )}
                  </PriceColumn>
                  <LeftColumn>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>
                      <ServiceIcon style={{ float: 'left', marginRight: 5 }} type={typeOfService} />
                      <span style={{ fontSize: 16 }}>{services[serv.service].title}</span>
                    </div>
                    {serv.selectedOption &&
                      selectedOptions[serv.selectedOption] && (
                        <div style={{ fontSize: 12 }}>
                          <I18nText data={selectedOptions[serv.selectedOption].title} />
                          {options && (
                            <ServiceOptions
                              selectOption={this.props.selectOption}
                              options={options}
                              serviceData={inDayService}
                              trip={this.props.trip}
                            />
                          )}
                        </div>
                      )}
                  </LeftColumn>
                  <RightColumn>
                    <div>
                      {this.renderCancellationPolicy(
                        selectedOptions[serv.selectedOption],
                        services[serv.service],
                        serv.firstDay,
                        serv.lastDay,
                      )}
                    </div>
                    <div>
                      {this.renderPrice(
                        selectedOptions[serv.selectedOption],
                        services[serv.service],
                        serv.firstDay,
                        serv.lastDay,
                      )}
                    </div>
                  </RightColumn>
                </Row>
                <BorderLine />
              </>
            );
          })}
        </Table>
        <TotalPrice>
          <H4 style={{ marginRight: '10px' }}>
            <Trans>Total Price</Trans>{' '}
            <span style={{ color: tertiary }}>${trip.bookablePrice.toFixed(2)}</span>
          </H4>
          <Button theme="primaryFilled" onClick={this.props.nextStep}>
            <PStrong>
              <Trans>Book my trip</Trans>
            </PStrong>
          </Button>
        </TotalPrice>
        <H2 style={{ marginRight: '10px', marginBottom: '10px' }}>Book separately</H2>
        <P>Tick the box once you have booked</P>
        <Table>
          <Header>
            <Type style={{ fontSize: 16 }}>
              <Trans>Type</Trans>
            </Type>
            <Name style={{ justifyContent: 'center' }}>
              <Trans>Name</Trans>
            </Name>
            <Dates>
              <Trans>Dates</Trans>
            </Dates>
            <ApproximatePrice>
              <Trans>Approximate Price</Trans>
            </ApproximatePrice>
            <BookingInfo>
              <Trans>Booking Information</Trans>
            </BookingInfo>
            <Status>
              <Trans>Status</Trans>
            </Status>
            <Notes>
              <Trans>Notes</Trans>
            </Notes>
          </Header>
          {externalServices.map(serv => {
            const typeOfService = getFirstCategoryLowerCase(services[serv.service].categories);
            const startDate = moment(this.props.trip.startDate).add(serv.firstDay - 1, 'days');
            const endDate = moment(this.props.trip.startDate).add(
              typeOfService === 'accommodation' ? serv.lastDay : serv.lastDay - 1,
              'days',
            );
            return (
              <>
                <Row key={`${serv.service}-${serv.firstDay}`}>
                  <Type>
                    <Trans>
                      <ServiceIcon type={typeOfService} />
                    </Trans>
                  </Type>
                  <Name>
                    <Trans>{services[serv.service].title}</Trans>
                  </Name>
                  <Dates>
                    {startDate.format('MMM DD')}
                    {!startDate.isSame(endDate, 'day') && (
                      <>
                        <br />
                        {endDate.format('MMM DD')}
                      </>
                    )}
                  </Dates>
                  <ApproximatePrice>
                    <Price>${extractPrice(services[serv.service].basePrice)}</Price>
                  </ApproximatePrice>
                  <BookingInfo>
                    {services[serv.service].externalUrl ? (
                      <a
                        href={services[serv.service].externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Trans>Visit website</Trans>
                      </a>
                    ) : (
                      ''
                    )}
                  </BookingInfo>
                  <Status>
                    <Trans>{this.renderStatusCheckbox(serv.serviceOrgId, serv.service)}</Trans>
                  </Status>
                  <Notes>
                    <Note serviceOrg={inDayServices[serv.serviceOrgId]} />
                  </Notes>
                  <LeftColumn>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>
                      <ServiceIcon style={{ float: 'left', marginRight: 5 }} type={typeOfService} />
                      <span style={{ fontSize: 16 }}>{services[serv.service].title}</span>
                    </div>
                  </LeftColumn>
                  <RightColumn>
                    <div>
                      {this.renderPrice(
                        selectedOptions[serv.selectedOption],
                        services[serv.service],
                        serv.firstDay,
                        serv.lastDay,
                      )}
                    </div>
                    {this.renderStatusCheckbox(serv.serviceOrgId, serv.service)}
                  </RightColumn>
                </Row>
                <BorderLine />
              </>
            );
          })}
        </Table>
        <TotalPrice>
          <H4 style={{ marginRight: '10px' }}>
            <Trans>Estimated Total Price</Trans>{' '}
            <span style={{ color: tertiary }}>${externalTotalPrice.toFixed(2)}</span>
          </H4>
        </TotalPrice>
      </React.Fragment>
    );
  }
}

CheckoutTrip.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default CheckoutTrip;
