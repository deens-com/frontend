// NPM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import history from 'main/history';
import { Loader, Popup, Icon, Dropdown, Dimmer } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import { calculateBottomPosition } from 'libs/Utils';

// COMPONENTS
import TopBar from 'shared_components/TopBar';

// STYLES
import { Page, PageContent } from 'shared_components/layout/Page';
import { media } from 'libs/styled';

import Header from './Header';
import TripDescription from './TripDescription';
import FixedFooter from './FixedFooter';
import Itinerary from './Itinerary';
import DaySelector from './DaySelector';
import mapServicesToDays from './mapServicesToDays';

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

const CustomPage = Page.extend`
  padding-bottom: 150px;
`;
const Wrapper = styled.div``;
const TripData = styled.div`
  background-color: #f7f7f7;
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
  color: #4fb798;
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

  .SingleDatePickerInput {
    visibility: hidden;
  }

  .SingleDatePicker {
    position: absolute;
    top: -53px;
    right: -100px;
  }

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
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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

  handleDatesChange = day => {
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
    this.checkAvailability(day, this.props.numberOfPeople);
  };

  handleGuestsChange = (_, data) => {
    this.handleGuestsPopupClose();
    this.props.changeDates({ person_nb: data.value });
    this.checkAvailability(this.props.startDate, data.value);
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

  handleCustomizeClick = () => {
    if (this.props.trip.owner === this.props.currentUserId) {
      history.push(`/trips/organize/${this.props.trip._id}`);
      return;
    }
    if (!this.props.currentUserId) {
      history.push('/login', {
        message: 'Please login or register to continue with your trip.',
        from: `/trips/${this.props.trip._id}`,
        action: 'handleCustomizeClick',
      });
      return;
    }
    this.props.cloneTrip(this.props.trip._id);
  };

  goToDay = index => {
    const domNode = ReactDOM.findDOMNode(this.childRefs[index].current);
    domNode.scrollIntoView(true);
    window.scrollBy(0, -140); // To avoid the header blocking a part of the day
  };

  assignRefs = refs => {
    this.childRefs = refs;
  };

  renderPageContent = () => {
    const {
      isLoading,
      trip,
      owner,
      numberOfPeople,
      availability,
      isCheckingAvailability,
      isCloning,
    } = this.props;

    if (isLoading || !trip) {
      return <Loader active size="massive" />;
    }

    const startDate = this.props.startDate && moment(parseInt(this.props.startDate, 10));
    const endDate = startDate && startDate.clone().add(this.props.trip.duration, 'minutes');
    const formattedStartDate = startDate ? startDate.format('MMM DD, YYYY') : '';
    const formattedEndDate = endDate ? endDate.format('MMM DD, YYYY') : '';

    const countries = getCountryCount(trip.services);
    const cities = getCityCount(trip.services);

    return (
      <Wrapper>
        <Dimmer active={isCloning} page>
          <Loader size="massive" />
        </Dimmer>
        <Header innerRef={this.headerRef} trip={trip} owner={owner} />
        <TripData innerRef={this.sentenceRef}>
          <Sentence>
            <SentenceText>I want this trip between</SentenceText>
            <EditableElement>
              <Popup
                trigger={
                  <p>
                    {(formattedStartDate && formattedStartDate + ' / ' + formattedEndDate) ||
                      'Dates'}
                  </p>
                }
                content={
                  <PopupContent>
                    <p>Select Starting Day</p>
                    <SingleDatePicker
                      id="startDate"
                      date={startDate}
                      onDateChange={this.handleDatesChange}
                      focused={this.state.isDatePopupOpen}
                      onFocusChange={({ focused }) =>
                        focused ? this.handleDatePopupOpen() : this.handleDatePopupClose()
                      }
                      placeholder={formattedStartDate}
                      isDayBlocked={date =>
                        date.valueOf() <=
                        moment()
                          .add(1, 'days')
                          .valueOf()
                      }
                      numberOfMonths={1}
                      small
                      noBorder
                      anchorDirection="right"
                      displayFormat="MM/DD/YY"
                      block
                    />
                    <Icon
                      style={{ position: 'relative', left: '265px', bottom: '44px' }}
                      name="close"
                      onClick={this.handleDatePopupClose}
                    />
                  </PopupContent>
                }
                on="click"
                position="bottom left"
                keepInViewPort
                open={this.state.isDatePopupOpen}
                onClose={this.handleDatePopupClose}
                onOpen={this.handleDatePopupOpen}
              />
            </EditableElement>
            <SentenceText> for</SentenceText>
            <EditableElement>
              <Popup
                trigger={<span>{numberOfPeople + ' Guests'}</span>}
                content={
                  <Dropdown
                    placeholder={numberOfPeople + ' Guests'}
                    options={[
                      { text: 1, value: 1 },
                      { text: 2, value: 2 },
                      { text: 3, value: 3 },
                      { text: 4, value: 4 },
                      { text: 5, value: 5 },
                    ]}
                    onChange={this.handleGuestsChange}
                    fluid
                    selection
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
        </TripData>
        <Body>
          <TripDescription trip={trip} cities={cities} countries={countries} />
          <Itinerary
            isCheckingAvailability={isCheckingAvailability}
            availability={availability}
            trip={trip}
            numberOfPeople={numberOfPeople}
            startDate={this.props.startDate}
            assignRefsToParent={this.assignRefs}
          />
        </Body>
      </Wrapper>
    );
  };

  render() {
    const { trip, numberOfPeople, isGDPRDismissed } = this.props;

    if (!trip) {
      return (
        <Page>
          <TopBar fixed />
          <PageContent>
            <Loader inline="centered" active />
          </PageContent>
        </Page>
      );
    }

    const days = mapServicesToDays(trip.services, trip.duration);

    return (
      <CustomPage>
        <TopBar fixed />
        <DaySelector
          bottom={calculateBottomPosition(isGDPRDismissed, 65)}
          days={days}
          trip={trip}
          goToDay={this.goToDay}
        />
        <PageContent>{this.renderPageContent()}</PageContent>
        <FixedFooter
          price={trip.basePrice}
          peopleNumber={numberOfPeople}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onCustomizeClick={this.handleCustomizeClick}
          bottom={calculateBottomPosition(isGDPRDismissed)}
        />
      </CustomPage>
    );
  }
}
