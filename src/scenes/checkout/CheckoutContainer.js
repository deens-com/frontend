import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import axios from 'libs/axios';
import { Loader, Dimmer } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
import { generateTripSlug } from 'libs/Utils';
import { updateBottomChatPosition, calculateBottomPosition } from 'libs/Utils';

import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import I18nText from 'shared_components/I18nText';
import CancellationPolicy from 'shared_components/CancellationPolicy';
import { formatLocation } from 'shared_components/Carts/Trip';
import { MapMarker, LeftArrow } from 'shared_components/icons';
import PaymentContainer from './PaymentContainer';
import BookingDone from './components/BookingDone';
import CheckoutTrip from './components/CheckoutTrip';
import * as actions from 'store/checkout/actions';
import tripActions from 'store/trips/actions';
import Button from 'shared_components/Button';
import GuestsData from './components/GuestsData';
import Countdown from './components/Countdown';
import ReprovisionModal from './components/ReprovisionModal';
import history from 'main/history';

function formatDate(date, days) {
  const startDate = moment(date);
  const endDate = moment(startDate)
    .clone()
    .add(days - 1, 'days');
  return `${startDate.format('MMM DD YYYY')} - ${endDate.format('MMM DD YYYY')}`;
}

const Wrapper = styled.div`
  max-width: 700px;
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

const BackButton = styled(Link)`
  display: inline-flex;
  position: relative;
  top: -5px;
  font-size: 14px;
  color: #38d39f;
  vertical-align: middle;
  > span {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  ${media.minSmall} {
    left: -260px;
    top: 20px;
  }
`;

const BackIcon = styled.span`
  background-color: #38d39f;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 35px;
  font-size: 24px;
  > svg {
    margin: auto;
  }
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
  background-color: ${props => (props.active ? '#38D39F' : 'white')};
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
  border: 1px solid #38d39f;
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
  bottom: ${props => props.bottom || 0}px;
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
    };

    props.fetchTrip(this.tripId);

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
    updateBottomChatPosition(
      calculateBottomPosition(this.props.isGDPRDismissed, this.props.gdprHeight, 50),
    );
  }

  componentWillUnmount() {
    updateBottomChatPosition();
  }

  componentDidUpdate() {
    if (this.props.trip) {
      if (this.props.trip.bookingStatus === 'booked') {
        history.replace(`/trips/${generateTripSlug(this.props.trip)}`);
        return;
      }
      if (!this.props.trip.startDate || !this.props.trip.adultCount) {
        this.goToTripOrganizer();
        return;
      }

      if (this.props.trip.services.length === 0) {
        this.goToTripOrganizer();
        return;
      }

      if (this.props.availability) {
        if (this.props.availability.some(service => !service.isAvailable)) {
          this.goToTripOrganizer();
          return;
        }
      } else if (!this.props.isCheckingAvailability) {
        this.props.checkAvailability(this.tripId, this.props.trip.startDate, {
          adults: this.props.trip.adultCount,
          children: this.props.trip.childrenCount,
          infants: this.props.trip.infantCount,
        });
      }
    }
  }

  goToTripOrganizer = () => {
    history.replace(`/trips/organize/${this.tripId}`);
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
          const provision = await axios.post(`/trips/${this.tripId}/provision`);

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
    this.setState({
      timedOut: true,
      expireDate: null,
    });
  };

  nextStep = () => {
    this.setState(
      prevState => ({
        step: prevState.step + 1,
        nextDisabled: prevState.step + 1 === 2,
      }),
      () => {
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

    if (step === 4) {
      return <BookingDone guests={guests} trip={trip} />;
    }

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
          />
        </Dimmer.Dimmable>
      );
    }

    return step === 1 ? (
      <CheckoutTrip trip={trip} />
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
    const { trip, isLoading, isGDPRDismissed, gdprHeight } = this.props;
    const { days, step, expireDate, timedOut } = this.state;
    const numberOfGuests = this.calculateGuests();
    return (
      <Page topPush>
        <TopBar fixed />
        {isLoading || !trip ? (
          <Loader inline="centered" active />
        ) : (
          <React.Fragment>
            <Wrapper>
              <Top>
                {step < 4 && (
                  <React.Fragment>
                    <BackButton to={`/trips/organize/${this.tripId}`} replace>
                      <BackIcon>
                        <LeftArrow />
                      </BackIcon>
                      <span>Back to customization</span>
                    </BackButton>
                    <Steps>
                      <Step active={step === 1}>
                        <span>1</span> Review Booking
                      </Step>
                      <StepSeparator />
                      <Step active={step === 2}>
                        <span>2</span> Guest Details
                      </Step>
                      <StepSeparator />
                      <Step active={step === 3}>
                        <span>3</span> Payment
                      </Step>
                    </Steps>
                  </React.Fragment>
                )}
              </Top>
              {step < 4 && (
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
                      <PriceLine>Total Price Booked Items ${trip.basePrice.toFixed(2)}</PriceLine>
                      <Taxes>* all taxes and fees are included</Taxes>
                    </TotalPrice>
                    <CancellationPolicy />
                  </TotalPriceWrapper>
                </Summary>
              )}
              {step === 3 &&
                expireDate && <Countdown expireDate={expireDate} onTimeout={this.onTimeout} />}
              {step === 3 &&
                timedOut && (
                  <ReprovisionModal
                    okClick={this.getProvisionCodes}
                    cancelClick={this.goToTripOrganizer}
                  />
                )}
              {this.renderStep()}
            </Wrapper>
            {step < 3 && (
              <Footer bottom={calculateBottomPosition(isGDPRDismissed, gdprHeight)}>
                <Button
                  disabled={this.state.nextDisabled}
                  theme="fillLightGreen"
                  onClick={this.nextStep}
                  size="small"
                  bold
                >
                  Next
                </Button>
              </Footer>
            )}
          </React.Fragment>
        )}
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.trips.trip,
  isLoading: state.trips.isLoading,
  session: state.SessionsReducer.session,
  isGDPRDismissed: state.settings.gdprDismissed,
  gdprHeight: state.settings.gdprHeight,
  availability: state.trips.availability.data,
  isCheckingAvailability: state.trips.availability.isChecking,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      fetchTrip: tripActions.fetchTrip,
      checkAvailability: tripActions.checkAvailability,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutContainer);
