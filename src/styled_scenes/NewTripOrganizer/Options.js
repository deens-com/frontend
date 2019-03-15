import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import SelectGuests from 'shared_components/SelectGuests';
import { DropArrow } from 'shared_components/icons';
import { PStrong, PSmall } from 'libs/commonStyles';
import { darkText } from 'libs/colors';
import Toggle from 'shared_components/ToggleSwitch';

const StickyPlaceholder = styled.div`
  display: flex;
  height: 66px;
`;

const Wrapper = styled.div`
  display: flex;
  padding: 20px 40px 10px;
  background-color: white;
  z-index: 3;
  ${props =>
    props.isSticky &&
    `
    box-shadow: 0 1px 1px 1px rgba(0,0,0,0.4);
    margin-top: 70px;
  `};
`;

const LeftSide = styled.div`
  justify-self: flex-start;
  flex: 1;
  display: flex;
`;

const RightSide = styled.div`
  justify-self: flex-end;
  flex-grow: 1;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  > *:first-child {
    margin-right: 10px;
  }
`;

const FakeDropdown = styled.div`
  background-color: #f8f8f8;
  color: #38d39f;
  width: 100%;
  padding: 6px 10px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  border-radius: 5px 5px 5px 0;
  > p {
    margin-right: 8px;
  }
  > svg {
    display: inline-block;
  }
`;

const DatePicker = styled(FakeDropdown)`
  width: auto;
  margin-left: 25px;
  padding: 0;
  input {
    color: inherit;
    font: inherit;
    font-weight: 700;
    background-color: #f8f8f8;
    color: #38d39f;
    border-radius: 5px 5px 5px 0;
    cursor: pointer;
  }
  > div > div > div {
    background-color: transparent;
    > div {
      background-color: transparent;
    }
  }
`;

const DepartureDate = styled(PStrong)`
  margin-left: 10px;
  color: ${darkText};
`;

const now = moment().add(1, 'days');
const isDayBlocked = date => date.valueOf() <= now.valueOf();

const Options = ({
  adults,
  children,
  infants,
  onChangeGuests,
  startDate,
  onChangeDate,
  changeShowTransport,
  changeShowMap,
  isSticky,
  style,
}) => {
  const formattedDate = startDate
    ? ` ${moment(startDate).format('MM/DD/YY')}`
    : 'Select departure date';
  const [dateFocused, setDateFocused] = useState(false);

  const onDateFocusChange = ({ focused }) => {
    setDateFocused(focused);
  };

  return (
    <>
      {isSticky && <StickyPlaceholder />}
      <Wrapper style={style} isSticky={isSticky}>
        <LeftSide>
          <SelectGuests
            adults={adults}
            infants={infants}
            children={children}
            onApply={onChangeGuests}
            renderTrigger={({ triggerPopup }) => (
              <FakeDropdown onClick={triggerPopup}>
                <PStrong>{adults + children + infants} Guests</PStrong>
                <DropArrow />
              </FakeDropdown>
            )}
          />
          <DatePicker>
            {startDate && (
              <DepartureDate onClick={() => onDateFocusChange({ focused: true })}>
                Departure date:
              </DepartureDate>
            )}
            <SingleDatePicker
              id="startDate"
              date={moment(startDate)}
              onDateChange={onChangeDate}
              focused={dateFocused}
              onFocusChange={onDateFocusChange}
              placeholder={formattedDate}
              isDayBlocked={isDayBlocked}
              numberOfMonths={1}
              small
              noBorder
              /*withPortal*/
              anchorDirection="right"
              displayFormat="MM/DD/YY"
            />
          </DatePicker>
        </LeftSide>
        <RightSide>
          <Toggle checkedByDefault onSwitch={changeShowTransport}>
            <PSmall>Add Transports</PSmall>
          </Toggle>
          <Toggle onSwitch={changeShowMap}>
            <PSmall>Show map</PSmall>
          </Toggle>
        </RightSide>
      </Wrapper>
    </>
  );
};

Options.propTypes = {
  onChangeGuests: PropTypes.func.isRequired,
  adults: PropTypes.number.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  changeShowTransport: PropTypes.func.isRequired,
  changeShowMap: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  children: PropTypes.number,
  infants: PropTypes.number,
  isSticky: PropTypes.bool,
};

Options.defaultProps = {
  isSticky: false,
  children: 0,
  infants: 0,
  startDate: null,
};

export default Options;
