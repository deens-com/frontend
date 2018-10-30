import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { Dropdown, Popup } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import Button from 'shared_components/Button';

const now = moment().add(1, 'days');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const Wrapper = styled.div`
  margin-top: 30px;
  text-align: center;
  ${media.minLarge} {
    position: fixed;
    top: 80px;
    bottom: 0;
    margin: auto;
    height: 400px;
    z-index: 1;
    right: 15px;
    min-width: 300px;
    width: calc(100vw - 80%);
  }
`;

const Box = styled.div`
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 30px 50px 24px;
  text-align: left;
  ${media.minLarge} {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const Divider = styled.div`
  border-bottom: 1px solid #c4c4c4;
  margin: 15px 0;
  ${media.minSmall} {
    margin-left: -50px;
    width: calc(100% + 100px);
  }
  ${media.minSmall} {
    margin-left: -15px;
    width: calc(100% + 30px);
  }
`;

const Field = styled.div`
  > div {
    font-weight: bold !important;
    border: 1px solid #eaeaea !important;
    background-color: #f8f8f8 !important;
  }
`;

const DropdownField = Field.extend`
  > div {
    color: #38d39f !important;
  }
`;

const Date = styled.div`
  input {
    font-weight: bold;
    color: #38d39f;
    border: 1px solid #eaeaea;
    background-color: #f8f8f8;
    padding: 0;
    border: 0;
    padding-bottom: 4px;
    padding-left: 5px;
    max-width: 85px;
    font-size: 15px;
    overflow: hidden;
  }
  div {
    background-color: #f8f8f8;
  }
  color: #3c434b;
  display: flex;
  padding: 10px 5px;
  border-radius: 5px;
`;

const ButtonWrap = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 12px;
  display: block;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

export default class CheckoutBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFocused: false,
    };
  }

  handleDateChange = date => {
    this.props.changeDates({
      start_date: date && date.valueOf(),
      //end_date: we have to add the duration of the trip
    });
  };

  handleGuestsChange = (event, data) => {
    this.props.changeGuests({ person_nb: data.value });
  };

  onDateFocusChange = ({ focused }) => {
    this.setState({
      dateFocused: focused,
    });
  };

  book = () => {
    this.props.action('book');
  };

  share = () => {
    this.props.action('share');
  };

  renderButtonWithPopup(button, content) {
    if (content) {
      return <Popup trigger={button} content={content} position="bottom left" hideOnScroll />;
    }
    return button;
  }

  render() {
    const { startDate, numberOfPeople, bookError, shareError, numberOfDays, days } = this.props;
    const formattedStartDate = startDate ? startDate.format('MM/DD/YY') : 'Select date';

    const addDay = days[days.length - 1].data.some(
      value => value.service.categories[0].names['en-us'] === 'Accommodation',
    )
      ? 1
      : 0;
    const endDate = startDate
      ? startDate
          .clone()
          .add(numberOfDays + addDay, 'days')
          .format('MM/DD/YY')
      : '';

    return (
      <Wrapper>
        <Box>
          <Price>Total Price Booked ${this.props.price * numberOfPeople}</Price>
          <Divider />
          <Field>
            <Label>Start Date</Label>
            <Date>
              <span onClick={() => this.onDateFocusChange({ focused: true })}>
                <span>Start</span>
                <SingleDatePicker
                  id="startDate"
                  date={startDate}
                  onDateChange={this.handleDateChange}
                  focused={this.state.dateFocused}
                  onFocusChange={this.onDateFocusChange}
                  placeholder={formattedStartDate}
                  isDayBlocked={isDayBlocked}
                  numberOfMonths={1}
                  small
                  noBorder
                  /*withPortal*/
                  anchorDirection="right"
                  displayFormat="MM/DD/YY"
                />
              </span>
              <span>End</span>
              <input disabled value={endDate} style={{ color: 'gray', paddingBottom: '2px' }} />
            </Date>
          </Field>
          <DropdownField>
            <Label>Number of Guests</Label>
            <Dropdown
              placeholder={numberOfPeople + ' Adults'}
              options={[
                { text: '1 Adult', value: 1 },
                { text: '2 Adults', value: 2 },
                { text: '3 Adults', value: 3 },
                { text: '4 Adults', value: 4 },
                { text: '5 Adults', value: 5 },
              ]}
              onChange={this.handleGuestsChange}
              defaultValue={numberOfPeople}
              fluid
              selection
            />
          </DropdownField>
          {this.renderButtonWithPopup(
            <ButtonWrap>
              <Button
                disableClick={Boolean(bookError)}
                size="medium"
                type="button"
                theme="fillLightGreen"
                onClick={this.book}
                width="100%"
                align="center"
                bold
              >
                Book
              </Button>
            </ButtonWrap>,
            bookError,
          )}
          {this.renderButtonWithPopup(
            <ButtonWrap>
              <Button
                disableClick={Boolean(shareError)}
                size="medium"
                type="button"
                theme="white"
                onClick={this.share}
                width="100%"
                align="center"
                bold
              >
                Share and earn rewards
              </Button>
            </ButtonWrap>,
            shareError,
          )}
        </Box>
      </Wrapper>
    );
  }
}
