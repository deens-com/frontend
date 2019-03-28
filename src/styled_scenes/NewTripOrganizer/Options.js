import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Popup } from 'semantic-ui-react'
import DateSelector from './DateSelector';
import { minutesToDays } from 'libs/Utils'
import SelectGuests from 'shared_components/SelectGuests';
import { DropArrow } from 'shared_components/icons';
import { PStrong, PSmall } from 'libs/commonStyles';
import { darkText } from 'libs/colors';
import Toggle from 'shared_components/ToggleSwitch';

const Wrapper = styled.div`
  display: flex;
  padding: 20px 40px 10px;
  background-color: white;
  z-index: 3;
  position: relative;
`;

const LeftSide = styled.div`
  justify-self: flex-start;
  flex: 1;
  display: flex;
`;

const DateP = styled(PStrong)`
  color: #38d39f;
  margin-left: 5px;
  &:first-child {
    margin-right: 10px;
  }
`

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
    background-color: white;
    > div {
      background-color: transparent;
    }
  }
`;

const DepartureDate = styled(PStrong)`
  margin-left: 10px;
  color: ${darkText};
  user-select: none;
  cursor: pointer;
  display: flex;
`;

const Options = ({
  adults,
  children,
  infants,
  onChangeGuests,
  startDate,
  changeShowTransport,
  changeShowMap,
  duration,
}) => {
  const formattedStartDate = startDate
    ? ` ${moment(startDate).format('MM/DD/YY')}`
    : 'Select departure date';

  const formattedEndDate = startDate
    ? ` ${moment(startDate).clone().add(minutesToDays(duration), 'days').format('MM/DD/YY')}`
    : '';
  
  const [isOpenDate, setOpenDate] = useState(false)

  const openDate = () => setOpenDate(true)
  const closeDate = () => setOpenDate(false)

  return (
    <Wrapper>
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
          <Popup
            position="center bottom"
            on="click"
            open={isOpenDate}
            onOpen={openDate}
            onClose={closeDate}
            trigger={(
              <DepartureDate>
                Start: <DateP>{formattedStartDate}</DateP> End: <DateP>{formattedEndDate}</DateP>
              </DepartureDate>
            )}
            content={(
              <DateSelector close={closeDate} />
            )}
            small
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
  );
};

Options.propTypes = {
  onChangeGuests: PropTypes.func.isRequired,
  adults: PropTypes.number.isRequired,
  changeShowTransport: PropTypes.func.isRequired,
  changeShowMap: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  children: PropTypes.number,
  infants: PropTypes.number,
};

Options.defaultProps = {
  children: 0,
  infants: 0,
  startDate: null,
};

export default Options;
