// NPM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Loader, Popup, Icon, Dropdown, Dimmer } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';

// COMPONENTS
import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

// STYLES
import { Page, PageContent } from 'shared_components/layout/Page';

import Header from './Header';
import TripDescription from './TripDescription';
import FixedFooter from './FixedFooter';
import Itinerary from './Itinerary';
import DaySelector from './DaySelector';

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
  p {
    display: inline-block;
  }
`;

export default class Trip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      isGuestsPopupOpen: false,
    };
  }

  checkAvailability = (startDate, people) => {
    if (startDate && people) {
      this.props.checkAvailability(this.props.trip._id, startDate, people);
    }
  };

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({
      start_date: start && start.valueOf(),
      end_date: end && end.valueOf(),
    });
    this.checkAvailability(start, this.props.numberOfPeople);
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
    const startDate = this.props.startDate && moment(parseInt(this.props.startDate, 10));
    const endDate = this.props.endDate && moment(parseInt(this.props.endDate, 10));
    const formattedStartDate = startDate ? startDate.format('LL') : '';
    const formattedEndDate = endDate ? endDate.format('LL') : '';

    if (isLoading || !trip) {
      return <Loader active size="massive" />;
    }

    return (
      <Wrapper>
        <Dimmer active={isCloning} page>
          <Loader size="massive" />
        </Dimmer>
        <Header trip={trip} owner={owner} />
        <TripData>
          <Sentence>
            I want this trip between
            <EditableElement>
              <Popup
                trigger={
                  <p>
                    {(formattedStartDate && formattedStartDate + ' / ' + formattedEndDate) ||
                      'Dates'}
                  </p>
                }
                content={
                  <div>
                    <DateRangePicker
                      startDateId="startDate"
                      endDateId="endDate"
                      startDate={startDate}
                      endDate={endDate}
                      onDatesChange={({ startDate, endDate }) => {
                        this.handleDatesChange({ startDate, endDate });
                      }}
                      focusedInput={this.state.focusedInput}
                      onFocusChange={focusedInput => {
                        this.setState({ focusedInput });
                      }}
                    />
                    <Icon
                      style={{ position: 'relative', left: '265px', bottom: '44px' }}
                      name="close"
                      onClick={this.clearDates}
                    />
                  </div>
                }
                on="click"
                position="bottom center"
                style={{ minWidth: '316px' }}
              />
            </EditableElement>
            <span> for</span>
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
      return null;
    }

    return (
      <Page>
        <TopBar fixed />
        <DaySelector trip={trip} goToDay={this.goToDay} />
        <PageContent>{this.renderPageContent()}</PageContent>
        <BrandFooter withTopBorder withPadding />
        <FixedFooter
          price={trip.basePrice}
          peopleNumber={numberOfPeople}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onCustomizeClick={this.handleCustomizeClick}
        />
      </Page>
    );
  }
}
