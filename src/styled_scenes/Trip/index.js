// NPM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Loader, Popup, Icon, Dropdown, Dimmer } from 'semantic-ui-react';
import { DayPicker } from 'react-dates';

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
`;

export default class Trip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDatePopupOpen: false,
      isGuestsPopupOpen: false,
    };
  }

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
    this.props.cloneTrip(this.props.trip._id);
  };

  goToDay = index => {
    const domNode = ReactDOM.findDOMNode(this.childRefs[index].current);
    domNode.scrollIntoView(true);
    window.scrollBy(0, -75); // To avoid the header blocking a part of the day
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

    return (
      <Wrapper>
        <Dimmer active={isCloning} page>
          <Loader size="massive" />
        </Dimmer>
        <Header trip={trip} owner={owner} />
        <TripData>
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
                    <p>Select Stat Day</p>
                    <DayPicker
                      onDayClick={this.handleDatesChange}
                      numberOfMonths={1}
                      initialVisibleMonth={() => (startDate && startDate.clone()) || moment()}
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
        <TripDescription trip={trip} />
        <Itinerary
          isCheckingAvailability={isCheckingAvailability}
          availability={availability}
          trip={trip}
          numberOfPeople={numberOfPeople}
          startDate={this.props.startDate}
          assignRefsToParent={this.assignRefs}
        />
      </Wrapper>
    );
  };

  render() {
    const { trip, numberOfPeople } = this.props;

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
        <DaySelector bottom={65} days={days} trip={trip} goToDay={this.goToDay} />
        <PageContent>{this.renderPageContent()}</PageContent>
        <FixedFooter
          price={trip.basePrice}
          peopleNumber={numberOfPeople}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onCustomizeClick={this.handleCustomizeClick}
        />
      </CustomPage>
    );
  }
}
