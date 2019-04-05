// NPM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import history from 'main/history';
import { Loader, Popup, Icon, Dimmer, Modal } from 'semantic-ui-react';
import { DayPickerRangeController } from 'react-dates';
import { START_DATE } from 'react-dates/constants';
import { updateBottomChatPosition } from 'libs/Utils';

// STYLES
import { Page, PageContent } from 'shared_components/layout/Page';
import GuestsSelector from 'shared_components/SelectGuests/GuestsSelector';
import { media } from 'libs/styled';

import Header from './Header';
import TripDescription from './TripDescription';
import FixedFooter from './FixedFooter';
import Itinerary from './Itinerary';
import DaySelector from './DaySelector';
import mapServicesToDays from './mapServicesToDays';
import analytics from 'libs/analytics';

const getCityCount = services => {
  const cities = new Set();
  services.forEach(data => cities.add(data.service.location.city));

  return cities.size;
};

const getCountryCount = services => {
  const countries = new Set();
  services.forEach(data => countries.add(data.service.location.countryCode));

  return countries.size;
};

const CustomPage = styled(Page)`
  padding-bottom: 150px;
`;
const Wrapper = styled.div``;
const TripData = styled.div`
  background-color: #38d39f;
  color: white;
  height: 65px;
  font-size: 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 5;
`;

const EditableElement = styled.div`
  margin-left: 5px;
  color: white;
  font-weight: bold;
  text-decoration: dashed underline;
  text-underline-position: under;
  cursor: pointer;
  display: inline-block;
`;

const Sentence = styled.div`
  display: flex;
  justify-content: space-evenly;
  ${media.minSmall} {
    justify-content: center;
  }

  > p {
    margin-left: 5px;
  }
`;

const SentenceText = styled.p`
  display: none;
  left: -50px;

  ${media.minSmall} {
    display: inline-block;
    left: auto;
  }
`;

const PopupContent = styled.div`
  width: 100%;
  position: relative;

  .close {
    display: none;
  }
`;

const Body = styled.div`
  max-width: 825px;
  margin: 0 auto;
`;

export default class Trip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDatePopupOpen: false,
      isGuestsPopupOpen: false,
    };

    this.sentenceRef = React.createRef();
    this.headerRef = React.createRef();

    this.ticking = false;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    if (this.props.action === 'handleCustomizeClick') {
      this.handleCustomizeClick();
    }

    updateBottomChatPosition(135);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    updateBottomChatPosition(0);
  }

  handleScroll = () => {
    if (!this.headerRef.current || !this.sentenceRef.current) {
      return;
    }

    const { top, height } = this.headerRef.current.getBoundingClientRect();
    const shouldBeFixed = top + height <= 65;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        if (shouldBeFixed) {
          this.sentenceRef.current.style.top = '65px';
          this.sentenceRef.current.style.position = 'fixed';
          this.sentenceRef.current.style.left = 0;
          this.sentenceRef.current.style.right = 0;
        } else {
          this.sentenceRef.current.style = {};
        }
        this.ticking = false;
      });

      this.ticking = true;
    }
  };

  checkAvailability = (startDate, people) => {
    if (startDate && people) {
      this.props.checkAvailability(this.props.trip._id, startDate, people);
    }
  };

  handleDatesChange = dates => {
    const day = dates.startDate;
    this.handleDatePopupClose();
    this.props.changeDates({
      start_date: day && day.valueOf(),
      end_date:
        day &&
        day
          .clone()
          .add(this.props.trip.duration, 'minutes')
          .valueOf(),
    });
    this.checkAvailability(day, {
      adults: this.props.adults,
      children: this.props.children,
      infants: this.props.infants,
    });
  };

  handleGuestsChange = data => {
    this.handleGuestsPopupClose();
    this.props.changeDates(data);
    this.checkAvailability(moment(this.props.startDate), data);
  };

  handleGuestsPopupClose = () => {
    this.setState({ isGuestsPopupOpen: false });
  };

  handleGuestsPopupOpen = () => {
    this.setState({ isGuestsPopupOpen: true });
  };

  handleDatePopupClose = () => {
    this.setState({ isDatePopupOpen: false });
  };

  handleDatePopupOpen = () => {
    this.setState({ isDatePopupOpen: true });
  };

  copyNewTrip = () => {
    this.handleCustomizeClick(null, true);
  };

  handleCustomizeClick = (event, force = false) => {
    if (this.props.trip.owner === this.props.currentUserId && !this.props.booked) {
      history.push(`/trips/organize/${this.props.trip._id}`);
      return;
    }
    analytics.trip.customize();
    this.props.cloneTrip(this.props.trip, this.props.currentUserId);
  };

  goToDay = index => {
    const domNode = ReactDOM.findDOMNode(this.childRefs[index].current);
    domNode.scrollIntoView(true);
    window.scrollBy(0, -140); // To avoid the header blocking a part of the day
  };

  assignRefs = refs => {
    this.childRefs = refs;
  };

  renderSentence = (startDate, endDate) => {
    const formattedStartDate = startDate ? startDate.format('MMM DD, YYYY') : '';
    const formattedEndDate = endDate ? endDate.format('MMM DD, YYYY') : '';

    if (this.props.booked) {
      return (
        <Sentence>
          <SentenceText>
            <span>Your trip booked for </span>
            <strong>{formattedStartDate && formattedStartDate + ' - ' + formattedEndDate}</strong>
            <span> for </span>
            <strong>
              {this.props.adults + this.props.children + this.props.infants + ' Guests'}
            </strong>
          </SentenceText>
        </Sentence>
      );
    }

    return (
      <Sentence>
        <SentenceText>
          <b>I want this trip between</b>
        </SentenceText>
        <EditableElement>
          <Popup
            trigger={
              <p>
                {(formattedStartDate && formattedStartDate + ' / ' + formattedEndDate) || 'Dates'}
              </p>
            }
            content={
              <PopupContent>
                <p>Select Starting Day</p>
                <DayPickerRangeController
                  initialVisibleMonth={() => startDate || moment()}
                  onDatesChange={this.handleDatesChange}
                  focusedInput={START_DATE}
                  onFocusChange={({ focused }) =>
                    focused ? this.handleDatePopupOpen() : this.handleDatePopupClose()
                  }
                  startDate={startDate}
                  endDate={endDate}
                  isDayBlocked={date =>
                    date.valueOf() <=
                    moment()
                      .add(1, 'days')
                      .valueOf()
                  }
                  daySize={35}
                  hideKeyboardShortcutsPanel
                  noBorder
                />
                <Icon
                  style={{ position: 'relative', left: '265px', bottom: '44px' }}
                  name="close"
                  onClick={this.handleDatePopupClose}
                />
              </PopupContent>
            }
            on="click"
            position="bottom center"
            keepInViewPort
            open={this.state.isDatePopupOpen}
            onClose={this.handleDatePopupClose}
            onOpen={this.handleDatePopupOpen}
          />
        </EditableElement>
        <SentenceText> for</SentenceText>
        <EditableElement>
          <Popup
            trigger={
              <span>
                {this.props.adults + this.props.children + this.props.infants + ' Guests'}
              </span>
            }
            content={
              <GuestsSelector
                adults={this.props.adults}
                children={this.props.children}
                infants={this.props.infants}
                close={this.handleGuestsPopupClose}
                onApply={this.handleGuestsChange}
                relative
              />
            }
            on="click"
            open={this.state.isGuestsPopupOpen}
            onClose={this.handleGuestsPopupClose}
            onOpen={this.handleGuestsPopupOpen}
            position="bottom center"
          />
        </EditableElement>
      </Sentence>
    );
  };

  renderPageContent = () => {
    const { isLoading, trip, owner, availability, isCheckingAvailability, isCloning } = this.props;
    if (isLoading || !trip) {
      return <Loader active size="massive" />;
    }

    const startDate = this.props.startDate && moment(parseInt(this.props.startDate, 10));
    const endDate = startDate && startDate.clone().add(this.props.trip.duration, 'minutes');

    const countries = getCountryCount(trip.services);
    const cities = getCityCount(trip.services);

    return (
      <Wrapper>
        <Dimmer active={isCloning} page>
          <Loader size="massive" />
        </Dimmer>
        <Header innerRef={this.headerRef} trip={trip} owner={owner} />
        <TripData ref={this.sentenceRef}>{this.renderSentence(startDate, endDate)}</TripData>
        <Body>
          <TripDescription trip={trip} cities={cities} countries={countries} />
          <Itinerary
            isCheckingAvailability={isCheckingAvailability}
            availability={availability}
            trip={trip}
            numberOfPeople={this.props.adults + this.props.children + this.props.infants}
            startDate={this.props.startDate}
            assignRefsToParent={this.assignRefs}
            bookedInformation={this.props.bookedInformation}
          />
        </Body>
      </Wrapper>
    );
  };

  render() {
    const { trip, adults, children, infants, isGDPRDismissed, gdprHeight } = this.props;

    if (!trip) {
      return (
        <PageContent>
          <Loader inline="centered" active />
        </PageContent>
      );
    }

    const days = mapServicesToDays(trip.services, trip.duration);

    return (
      <CustomPage>
        <DaySelector bottom={65} days={days} trip={trip} goToDay={this.goToDay} />
        <PageContent>{this.renderPageContent()}</PageContent>
        <FixedFooter
          price={trip.basePrice}
          peopleNumber={adults + children + infants}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          booked={this.props.booked}
          onCustomizeClick={this.handleCustomizeClick}
        />
      </CustomPage>
    );
  }
}
