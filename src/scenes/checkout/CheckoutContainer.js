import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import axios from 'libs/axios';
import { Loader, Dimmer, Modal } from 'semantic-ui-react';
import { media } from 'libs/styled';
import { generateTripSlug } from 'libs/Utils';

import I18nText from 'shared_components/I18nText';
import { formatLocation } from 'shared_components/Carts/Trip';
import MapMarker from 'shared_components/icons/MapMarker';
import PaymentContainer from './PaymentContainer';
import CheckoutTrip from './components/CheckoutTrip';
import * as actions from 'store/checkout/actions';
import headerActions from 'store/header/actions';
import Button from 'shared_components/Button';
import GuestsData from './components/GuestsData';
import Countdown from './components/Countdown';
import ReprovisionModal from './components/ReprovisionModal';
import tripDesignerActions from 'store/trip-designer/actions';
import history from 'main/history';
import analytics from 'libs/analytics';
import urls from 'libs/urlGenerator';
import { PRIVACY_PUBLIC } from 'libs/trips';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

function formatDate(date, days) {
  const startDate = moment(date);
  const endDate = moment(startDate)
    .clone()
    .add(days - 1, 'days');
  return `${startDate.format('MMM DD YYYY')} - ${endDate.format('MMM DD YYYY')}`;
}

const Wrapper = styled.div`
  max-width: 1150px;
  width: calc(100% - 30px);
  margin: 0 15px 70px;
  display: flex;
  flex-direction: column;
  ${media.minSmall} {
    width: 100%;
    margin: 0 auto 70px;
  }
`;

const Top = styled.div`
  margin-bottom: 35px;
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-items: center;
  ${media.minSmall} {
    flex-direction: row;
    margin-top: 0;
    justify-content: center;
  }
`;

const Step = styled.div`
  font-size: 14px;
  color: ${props => (props.active ? 'white' : '#6E7885')};
  background-color: ${props => (props.active ? '#097DA8' : 'white')};
  padding: 8px 10px;
  border-radius: 3px;

  > span {
    font-weight: bold;
  }
`;

const StepSeparator = styled.div`
  display: none;
  width: 40px;
  border-bottom: 1px solid #e0e0e0;
  margin: auto 15px;
  ${media.minSmall} {
    display: block;
  }
`;

const Location = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 14px;
  align-items: center;
  margin-top: 8px;
  > span {
    margin-left: 5px;
  }
`;

const Summary = styled.div`
  display: flex;
  order: 0;
  margin-bottom: 20px;
  flex-direction: column;
  ${media.minSmall} {
    flex-direction: row;
  }
`;

const SummaryData = styled.div`
  flex: 1;
  color: #3c434b;
`;

const PriceLine = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Taxes = styled.div`
  color: #6e7885;
  font-size: 12px;
`;

const TotalPriceWrapper = styled.div``;

const TotalPrice = styled.div`
  border-radius: 5px;
  border: 1px solid #097da8;
  background-color: #b9ffe7;
  padding: 20px;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  ${media.minSmall} {
    margin-top: 0;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Dates = styled.div`
  font-size: 14px;
  font-weight: bold;
  ${media.minSmall} {
    margin-top: 12px;
  }
`;

const Guests = styled.div`
  font-size: 14px;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
  padding: 10px 0;
  button {
    padding-right: 25px;
    padding-left: 25px;
  }
`;

function stateFromProps(props) {
  return {
    days: props.trip.duration / 1440 || 1,
    guests: [
      ...Array.from({ length: props.trip.adultCount }).map(_ => ({ type: 'adult' })),
      ...Array.from({ length: props.trip.childrenCount }).map(_ => ({ type: 'child' })),
      ...Array.from({ length: props.trip.infantCount }).map(_ => ({ type: 'infant' })),
    ],
  };
}

class CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.tripId = props.match.params.id;
    this.state = {
      step: 1,
      days: null,
      guests: [],
      provision: [],
      nextDisabled: false,
      isPaying: false,
    };

    if (props.trip && props.trip.id === this.tripId) {
      this.state = {
        ...this.state,
        ...stateFromProps(props),
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.trip) {
      return null;
    }
    const guests =
      props.trip.adultCount + (props.trip.childrenCount || 0) + (props.trip.infantCount || 0);

    if (!state.days || guests !== state.guests.length) {
      return stateFromProps(props);
    }
    return null;
  }

  componentDidMount() {
    this.props.cleanPaymentStatus();
  }

  componentDidUpdate() {
    if (this.props.trip && !this.state.errorMsg) {
      if (this.props.trip && this.props.trip.owner !== this.props.session._id) {
        if (this.props.trip.privacy === PRIVACY_PUBLIC) {
          history.replace(
            urls.trip.view({
              slug: generateTripSlug(this.props.trip),
              id: this.props.trip._id,
            }),
          );
          return;
        }
        history.replace('/');
        return;
      }
      if (this.props.trip.bookingStatus === 'booked') {
        history.replace(
          urls.trip.view({
            slug: generateTripSlug(this.props.trip),
            id: this.props.trip._id,
          }),
        );
        return;
      }
      if (!this.props.trip.startDate) {
        this.setState({
          errorMsg: 'You need to select a date',
        });
        return;
      }

      if (moment(this.props.trip.startDate).isSameOrBefore(moment(), 'day')) {
        this.setState({
          errorMsg: 'You need to select a date in the future',
        });
        return;
      }

      if (!this.props.trip.adultCount) {
        this.setState({
          errorMsg: 'Your trip should have at least one adult',
        });
        return;
      }

      if (this.props.trip.services.length === 0) {
        this.setState({
          errorMsg: 'You need to add at least one service to book a trip',
        });
        return;
      }

      if (Object.keys(this.props.availability) !== 0) {
        if (
          Object.keys(this.props.availability).some(id => !this.props.availability[id].isAvailable)
        ) {
          this.setState({
            errorMsg: 'Some of the services are not available in the selected dates',
          });
          return;
        }
      }
    }
  }

  goToTripOrganizer = () => {
    history.replace(urls.trip.organize(this.tripId));
  };

  startPayment = () => {
    this.setState({
      isPaying: true,
    });
  };

  finishPayment = () => {
    analytics.trip.checkout.complete();
    this.setState({
      isPaying: false,
    });
  };

  getProvisionCodes = () => {
    this.setState(
      {
        loadingProvision: true,
        errorProvision: null,
        timedOut: false,
      },
      async () => {
        try {
          const provision = await axios.post(`/bookings/trips/${this.tripId}/provision`);

          if (provision.data.some(service => !service.provisioned)) {
            throw new Error('Some services could not be provisioned');
          }

          const expireDate = provision.data.reduce((prevDate, element) => {
            if (element.expireAt && element.expireAt < prevDate) {
              return moment(element.expireAt).valueOf();
            }
            return prevDate;
          }, null);

          this.setState({
            provision: provision.data,
            loadingProvision: false,
            expireDate:
              expireDate ||
              moment()
                .add(10, 'minutes')
                .valueOf(),
            timedOut: false,
          });
        } catch (error) {
          this.setState({
            errorProvision: error.message ? error.message : error.response.data,
          });
        }
      },
    );
  };

  onTimeout = () => {
    this.setState(prevState => ({
      timedOut: prevState.step === 3,
      expireDate: null,
    }));
  };

  nextStep = () => {
    this.setState(
      prevState => ({
        step: prevState.step + 1,
        nextDisabled: prevState.step + 1 === 2,
      }),
      () => {
        if (this.state.step === 2) {
          analytics.trip.checkout.start();
        }
        if (this.state.step === 3 && this.state.provision.length === 0) {
          this.getProvisionCodes();
        }
      },
    );
  };

  handleGuestsDataChange = (event, data) => {
    this.setState(
      prevState => ({
        guests: prevState.guests.map(
          (guest, i) => (i === data.guest ? { ...guest, [data.name]: data.value } : guest),
        ),
      }),
      () => {
        this.setState(prevState => ({
          nextDisabled: prevState.guests.some(
            guest => !guest.title || !guest.firstName || !guest.lastName,
          ),
        }));
      },
    );
  };

  calculateGuests = () =>
    this.props.trip
      ? this.props.trip.adultCount +
        (this.props.trip.childrenCount || 0) +
        (this.props.trip.infantCount || 0)
      : 0;

  renderStep() {
    const { step, guests, loadingProvision, errorProvision } = this.state;
    const { trip } = this.props;

    if (step === 3) {
      return (
        <Dimmer.Dimmable dimmed={loadingProvision}>
          <Dimmer inverted active={loadingProvision}>
            <Loader />
          </Dimmer>
          <PaymentContainer
            getProvisionCodes={this.getProvisionCodes}
            error={errorProvision}
            nextStep={this.nextStep}
            guests={guests}
            trip={trip}
            startPayment={this.startPayment}
            finishPayment={this.finishPayment}
          />
        </Dimmer.Dimmable>
      );
    }

    return step === 1 ? (
      <CheckoutTrip
        nextStep={this.nextStep}
        selectOption={this.props.selectOption}
        availabilities={this.props.availability}
        selectedOptions={this.props.selectedOptions}
        trip={trip}
        inDayServices={this.props.inDayServices}
        services={this.props.services}
      />
    ) : (
      <GuestsData
        guests={this.state.guests}
        onChange={this.handleGuestsDataChange}
        nextDisable={this.nextDisable}
        nextEnable={this.nextEnable}
      />
    );
  }

  render() {
    const { trip, isLoading } = this.props;
    const { days, step, expireDate, timedOut, errorMsg } = this.state;
    const numberOfGuests = this.calculateGuests();

    return isLoading || !trip ? (
      <Loader inline="centered" active />
    ) : (
      <React.Fragment>
        <Modal
          open={Boolean(errorMsg)}
          content={errorMsg}
          size="mini"
          actions={[
            {
              key: 'trip',
              content: 'Go back to trip designer',
              onClick: this.goToTripOrganizer,
            },
          ]}
        />
        <Wrapper>
          <Top>
            {step < 4 &&
              step > 1 && (
                <React.Fragment>
                  <Steps>
                    <Step active={step === 1}>
                      <span>1</span> <Trans>Review Booking</Trans>
                    </Step>
                    <StepSeparator />
                    <Step active={step === 2}>
                      <span>2</span> <Trans>Guest Details</Trans>
                    </Step>
                    <StepSeparator />
                    <Step active={step === 3}>
                      <span>3</span> <Trans>Payment</Trans>
                    </Step>
                  </Steps>
                </React.Fragment>
              )}
          </Top>
          {step < 4 &&
            step > 1 && (
              <Summary>
                <SummaryData>
                  <Title>
                    <I18nText data={trip.title} />
                  </Title>
                  <Location>
                    <MapMarker style={{ fill: '#6E7885' }} />
                    <span>{formatLocation(trip.location)}</span>
                  </Location>
                  <Dates>{formatDate(trip.startDate, days)}</Dates>
                  <Guests>
                    {numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}
                  </Guests>
                </SummaryData>
                <TotalPriceWrapper>
                  <TotalPrice>
                    <PriceLine>
                      <Trans>Total Price of booked items</Trans> ${trip.bookablePrice.toFixed(2)}
                    </PriceLine>
                    <Taxes>
                      * <Trans>taxes and fees are included</Trans>
                    </Taxes>
                  </TotalPrice>
                </TotalPriceWrapper>
              </Summary>
            )}
          {step === 3 &&
            expireDate && (
              <Countdown
                isPaying={this.state.isPaying}
                expireDate={expireDate}
                onTimeout={this.onTimeout}
              />
            )}
          {step === 3 &&
            timedOut &&
            !this.state.isPaying && (
              <ReprovisionModal
                okClick={this.getProvisionCodes}
                cancelClick={this.goToTripOrganizer}
              />
            )}
          {this.renderStep()}
        </Wrapper>
        {step < 3 &&
          step > 1 && (
            <Footer>
              <Button
                disabled={this.state.nextDisabled}
                theme="fillLightGreen"
                onClick={this.nextStep}
                size="small"
                bold
              >
                <Trans>Next</Trans>
              </Button>
            </Footer>
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.tripDesigner.trip.data,
  isLoading: state.tripDesigner.trip.isLoading,
  session: state.session.session,
  isGDPRDismissed: state.settings.gdprDismissed,
  gdprHeight: state.settings.gdprHeight,
  availability: state.tripDesigner.availabilities.data,
  isCheckingAvailability: state.tripDesigner.availabilities.isLoading,
  services: state.entities.services,
  inDayServices: state.entities.inDayServices,
  selectedOptions: state.entities.selectedOptions,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      changeHeader: headerActions.changeHeader,
      selectOption: tripDesignerActions.selectOption,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutContainer);
