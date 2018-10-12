import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import axios from 'libs/axios';
import { Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import I18nText from 'shared_components/I18nText';
import { formatLocation } from 'shared_components/Carts/Trip';
import { MapMarker } from 'shared_components/icons';
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
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const Location = styled.div`
  display: flex;
  font-weight: bold;
`;

const Summary = styled.div`
  display: flex;
  order: 0;
`;

const SummaryData = styled.div`
  flex: 1;
  color: #3c434b;
  margin-bottom: 20px;
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
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Dates = styled.div`
  font-size: 14px;
  font-weight: bold;
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
`;

const BackButton = styled(Link)`
  position: relative;
  left: -250px;
  top: 20px;
  font-size: 14px;
  color: #38d39f;
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
        days: props.trip.services.reduce((set, service) => set.add(service.day), new Set()).size,
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

  nextEnable = () => {
    this.setState({
      nextDisabled: false,
    });
  };

  nextDisable = () => {
    this.setState({
      nextDisabled: true,
    });
  };

  handleGuestsDataChange = (event, data) => {
    console.log(this.state.guests.length);
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
              {step < 4 && (
                <BackButton to={`/trips/organize/${this.tripId}`} replace>
                  Back to customization
                </BackButton>
              )}
              <Summary>
                <SummaryData>
                  <Title>
                    <I18nText data={trip.title} />
                  </Title>
                  <Location>
                    <MapMarker style={{ fill: '#6E7885' }} />
                    {formatLocation(trip.location)}
                  </Location>
                  <Dates>{formatDate(trip.startDate, days)}</Dates>
                  <Guests>{trip.peopleCount} Guests</Guests>
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
                  size="medium"
                  theme="fillLightGreen"
                  onClick={this.nextStep}
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
