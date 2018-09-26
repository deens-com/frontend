// NPM
import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Loader, Popup, Icon } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';

// COMPONENTS
import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';

// STYLES
import { Page, PageContent } from 'shared_components/layout/Page';

import Header from './Header';
import TripDescription from './TripDescription';
import FixedFooter from './FixedFooter';

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

const Sentence = styled.div``;

export default class Trip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
    };
  }

  handleDatesChange = dateRange => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    this.props.changeDates({ start_date: start, end_date: end });
  };

  renderPageContent = () => {
    const { isLoading, trip, owner, startDate, endDate } = this.props;
    console.log(startDate);
    const formattedStartDate = startDate ? moment(parseInt(startDate, 10)).format('YYYY-M-D') : '';
    const formattedEndDate = endDate ? moment(parseInt(endDate, 10)).format('YYYY-M-D') : '';

    if (isLoading || !trip) {
      return <Loader active inline="centered" size="massive" />;
    }

    return (
      <Wrapper>
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
                //open={this.state.isDatesPopupOpen}
                onClose={this.handleDatesPopupClose}
                onOpen={this.handleDatesPopupOpen}
                position="bottom center"
                style={{ minWidth: '316px' }}
              />
            </EditableElement>
          </Sentence>
        </TripData>
        <TripDescription trip={trip} />
      </Wrapper>
    );
  };

  render() {
    const { trip, peopleNumber } = this.props;

    if (!trip) {
      return null;
    }

    return (
      <Page>
        <TopBar fixed />
        <PageContent>{this.renderPageContent()}</PageContent>
        <BrandFooter withTopBorder withPadding />
        <FixedFooter days={5} price={trip.basePrice} peopleNumber={peopleNumber} />
      </Page>
    );
  }
}
