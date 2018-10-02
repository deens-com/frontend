import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';
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

  render() {
    const { startDate, numberOfPeople } = this.props;
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
            fluid
            selection
          />
        </Field>
        <Button size="medium" type="button" theme="fillLightGreen" onClick={this.props.action}>
          Book
        </Button>
        <Button size="medium" type="button" theme="white" onClick={() => {}}>
          Share and earn rewards
        </Button>
      </Wrapper>
    );
  }
}

/*
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
        */
