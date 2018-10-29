import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import axios from 'libs/axios';
import { Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';

import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import I18nText from 'shared_components/I18nText';
import { formatLocation } from 'shared_components/Carts/Trip';
import { MapMarker, LeftArrow } from 'shared_components/icons';
import PaymentContainer from './PaymentContainer';
import BookingDone from './components/BookingDone';
import CheckoutTrip from './components/CheckoutTrip';
import * as actions from './actions';
import * as tripActions from '../trip/actions';
import Button from 'shared_components/Button';
import GuestsData from './components/GuestsData';
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

class CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.tripId = props.match.params.id;
    props.fetchTrip(this.tripId);
    this.state = {
      step: 1,
      days: null,
      guests: [],
      provision: [],
      nextDisabled: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.trip && !state.days) {
      return {
        days: props.trip.duration / 1440 || 1,
        guests: Array.from({ length: props.trip.peopleCount }).map(_ => ({})),
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.cleanPaymentStatus();
  }

  componentDidUpdate() {
    if (this.props.trip) {
      if (!this.props.trip.startDate || !this.props.trip.peopleCount) {
        history.replace(`/trips/organize/${this.tripId}`);
        return null;
      }
    }
  }

  async getProvisionCodes() {
    try {
      const provision = await axios.post(`/trips/${this.tripId}/provision`);
      this.setState({
        provision: provision.data,
      });
    } catch (error) {
      console.error('provision failed', error.response.data);
    }
  }

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
    console.log(data);
    this.setState(
      prevState => ({
        guests: prevState.guests.map(
          (guest, i) => (i === data.guest ? { ...guest, [data.name]: data.value } : guest),
        ),
      }),
      () => {
        this.setState(
          prevState =>
            console.log(prevState) || {
              nextDisabled: prevState.guests.some(
                guest => !guest.title || !guest.firstName || !guest.lastName,
              ),
            },
        );
      },
    );
  };

  renderStep() {
    const { step, guests } = this.state;
    const { trip } = this.props;

    if (step === 4) {
      return <BookingDone guests={guests} trip={trip} />;
    }
    if (step === 3) {
      return <PaymentContainer nextStep={this.nextStep} guests={guests} trip={trip} />;
    }
    return step === 1 ? (
      <CheckoutTrip trip={trip} />
    ) : (
      <GuestsData
        number={trip.peopleCount}
        onChange={this.handleGuestsDataChange}
        nextDisable={this.nextDisable}
        nextEnable={this.nextEnable}
      />
    );
  }

  render() {
    const { trip, isLoading } = this.props;
    const { days, step } = this.state;

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
                    {trip.peopleCount} {trip.peopleCount === 1 ? 'Guest' : 'Guests'}
                  </Guests>
                </SummaryData>
                <TotalPrice>
                  <PriceLine>Total Price Booked Items ${trip.basePrice}</PriceLine>
                  <Taxes>* all taxes and fees are included</Taxes>
                </TotalPrice>
              </Summary>
              {this.renderStep()}
            </Wrapper>
            {step < 3 && (
              <Footer>
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
  trip: state.TripReducer.trip,
  isLoading: state.TripReducer.isLoading,
  session: state.SessionsReducer.session,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
      fetchTrip: tripActions.fetchTrip,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutContainer);
