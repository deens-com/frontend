import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Dropdown, Popup } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import Button from 'shared_components/Button';

const now = moment().add(1, 'days');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const Wrapper = styled.div`
  position: fixed;
  right: 15px;
  border: 1px solid #dfdfdf;
  z-index: 100;
  margin-top: 250px;
  width: 300px;
  border-radius: 5px;
  padding: 40px 14px 24px;
  display: flex;
  flex-direction: column;
`;

const Field = styled.div``;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  display: block;
`;

const Price = styled.div`
  font-weight: bold;
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
    const { startDate, numberOfPeople, bookError, shareError } = this.props;
    const formattedStartDate = startDate ? startDate.format('LL') : 'Select date';

    return (
      <Wrapper>
        <Field>
          <Label>Start Date</Label>
          <SingleDatePicker
            id="startDate"
            date={startDate}
            onDateChange={this.handleDateChange}
            focused={this.state.dateFocused}
            onFocusChange={this.onDateFocusChange}
            placeholder={formattedStartDate}
            isDayBlocked={isDayBlocked}
          />
        </Field>
        <Field>
          <Label>Number of Guests</Label>
          <Dropdown
            placeholder={numberOfPeople + ' Guests'}
            options={[
              { text: '1 Guest', value: 1 },
              { text: '2 Guests', value: 2 },
              { text: '3 Guests', value: 3 },
              { text: '4 Guests', value: 4 },
              { text: '5 Guests', value: 5 },
            ]}
            onChange={this.handleGuestsChange}
            defaultValue={numberOfPeople}
            fluid
            selection
          />
        </Field>
        <Price>${this.props.price * numberOfPeople}</Price>
        {this.renderButtonWithPopup(
          <div>
            <Button
              disableClick={Boolean(bookError)}
              size="medium"
              type="button"
              theme="fillLightGreen"
              onClick={this.book}
            >
              Book
            </Button>
          </div>,
          bookError,
        )}
        {this.renderButtonWithPopup(
          <div>
            <Button
              disableClick={Boolean(shareError)}
              size="medium"
              type="button"
              theme="white"
              onClick={this.share}
            >
              Share and earn rewards
            </Button>
          </div>,
          shareError,
        )}
      </Wrapper>
    );
  }
}
