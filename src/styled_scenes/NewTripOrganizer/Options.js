import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import Popup from 'shared_components/Popup';
import DateSelector from './DateSelector';
import HelpMe from 'shared_components/HelpMe';
import { minutesToDays } from 'libs/Utils';
import SelectGuests from 'shared_components/SelectGuests';
import DropArrow from 'shared_components/icons/DropArrow';
import { PStrong, PSmall } from 'libs/commonStyles';
import { textDark } from 'libs/colors';
import Toggle from 'shared_components/ToggleSwitch';
import apiClient from 'libs/apiClient';
import analytics from 'libs/analytics';
import { media } from 'libs/styled';
import { TripContext } from './index';

const Wrapper = styled.div`
  display: flex;
  padding: 20px 40px 10px;
  background-color: white;
  position: relative;
  flex-direction: column;
  align-items: center;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const LeftSide = styled.div`
  justify-self: flex-start;
  flex: 1;
  display: flex;
`;

const DateP = styled(PStrong)`
  color: #097da8;
  margin-left: 5px;
  &:first-child {
    margin-right: 10px;
  }
`;

const RightSide = styled.div`
  justify-self: flex-end;
  flex-grow: 1;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  margin-top: 15px;
  ${media.minMedium} {
    margin-top: 0;
  }
  > * {
    margin-right: 10px;
  }
  > *:last-child {
    margin-right: 0;
  }
`;

const FakeDropdown = styled.div`
  background-color: #f8f8f8;
  color: #097da8;
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
    color: #097da8;
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
  color: ${textDark};
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
  tripParents,
}) => {
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const { tripId } = useContext(TripContext);

  useEffect(() => {
    async function getParentOwner() {
      if (tripParents.length === 0) {
        setLoadingUser(false);
        return;
      }
      const trip = (await apiClient.trips.getById(
        { include: 'owner' },
        tripParents[0].serviceGroup,
      )).data;
      setUser(trip.owner);
      setLoadingUser(false);
    }
    getParentOwner();
  }, []);

  const formattedStartDate = startDate
    ? ` ${moment(startDate).format('MM/DD/YY')}`
    : 'Select departure date';

  const formattedEndDate = startDate
    ? ` ${moment(startDate)
        .clone()
        .add(minutesToDays(duration), 'days')
        .format('MM/DD/YY')}`
    : '';

  const [isOpenDate, setOpenDate] = useState(false);

  const openDate = () => setOpenDate(true);
  const closeDate = () => setOpenDate(false);

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
            position="bottom center"
            on="click"
            open={isOpenDate}
            onOpen={openDate}
            onClose={closeDate}
            trigger={
              <DepartureDate>
                Start: <DateP>{formattedStartDate}</DateP> End: <DateP>{formattedEndDate}</DateP>
              </DepartureDate>
            }
            content={<DateSelector close={closeDate} />}
            small
          />
        </DatePicker>
      </LeftSide>
      <RightSide>
        <HelpMe
          tripParent={tripParents[0] && tripParents[0].serviceGroup}
          isLoadingUser={isLoadingUser}
          user={user}
          tripId={tripId}
        />
        <Toggle onSwitch={changeShowTransport}>
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
