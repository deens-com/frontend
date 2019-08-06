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
import { primary, disabled } from 'libs/colors';
import { media } from 'libs/styled';
import { TripContext } from './index';
import useResponsive from 'hooks/useResponsive';
import { detectScreenSize } from 'libs/Utils';
import Icon from 'shared_components/icons/Options';
import mapImg from './map.jpg';
import CrossIcon from 'shared_components/icons/CrossIcon';

// i18n
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  display: block;
  padding: 20px 40px 10px;
  background-color: white;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  ${media.minLargePlus} {
    display: flex;
  }
`;

const LeftSide = styled.div`
  justify-self: flex-start;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  ${props =>
    !props.isOpen &&
    `
    display: none;
    ${media.minLargePlus} {
      display: flex;
    }
  `} > * {
    margin-bottom: 6px;
    ${media.minLargePlus} {
      margin-bottom: 0;
    }
  }
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
  position: absolute;
  top: 0;
  right: 0;
  ${media.minLargePlus} {
    margin-top: 0;
    position: relative;
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
  margin-right: 25px;
  padding: 6px 10px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  border-radius: 5px 5px 5px 0;
  margin-bottom: 9px;
  > p {
    margin-right: 8px;
  }
  > svg {
    display: inline-block;
  }
`;

const DatePicker = styled(FakeDropdown)`
  width: auto;
  margin-bottom: 15px;
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

const OnlyOnDesktop = styled.span`
  display: none;
  ${media.minLargePlus} {
    display: flex;
  }
`;

const OnlyOnMobile = styled.span`
  margin-top: 10px;
  display: flex;
  ${media.minLargePlus} {
    display: none;
  }
`;

const DepartureDate = styled(PStrong)`
  margin-left: 10px;
  color: ${textDark};
  user-select: none;
  cursor: pointer;
  display: flex;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: ${props => (props.isOpen ? disabled : primary)};
  font-size: 28px;
  display: inline-block;
  margin-bottom: 10px;
  ${media.minLargePlus} {
    display: none;
  }
`;

const MapToggleMobile = styled.div`
  cursor: pointer;
  height: 50px;
  width: 50px;
  border-radius: 50px;
  border: 2px solid white;
  z-index: 5;
  right: 15px;
  bottom: 15px;
  position: fixed;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  background: url(${mapImg});
  background-size: cover;
  color: ${primary};
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props =>
    props.isShowing &&
    `
    background: white;
  `} ${media.minLargePlus} {
    display: none;
  }
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
  showingMap,
}) => {
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const { tripId } = useContext(TripContext);

  useEffect(
    () => {
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
    },
    [tripParents],
  );

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
  const [isOpenMenu, setOpenMenu] = useState(false);

  const onChangeScreenSize = () => {
    const currentSize = detectScreenSize();
    if (currentSize !== 'medium' && currentSize !== 'small') {
      setOpenMenu(false);
    }
  };

  useResponsive(onChangeScreenSize);

  const openDate = () => setOpenDate(true);
  const closeDate = () => setOpenDate(false);

  return (
    <>
      <Wrapper>
        <MenuIcon
          onClick={() => {
            setOpenMenu(open => !open);
          }}
          isOpen={isOpenMenu}
        >
          <Icon />
        </MenuIcon>
        <LeftSide isOpen={isOpenMenu}>
          <SelectGuests
            adults={adults}
            infants={infants}
            children={children}
            onApply={onChangeGuests}
            renderTrigger={({ triggerPopup }) => (
              <FakeDropdown onClick={triggerPopup}>
                <PStrong>
                  {adults + children + infants} <Trans>Guests</Trans>
                </PStrong>
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
                  <Trans>Start:</Trans> <DateP>{formattedStartDate}</DateP> <Trans>End:</Trans>{' '}
                  <DateP>{formattedEndDate}</DateP>
                </DepartureDate>
              }
              content={<DateSelector close={closeDate} />}
              small
            />
          </DatePicker>
          <OnlyOnMobile>
            <Toggle onSwitch={changeShowTransport}>
              <PSmall>
                <Trans>Transports</Trans>
              </PSmall>
            </Toggle>
          </OnlyOnMobile>
        </LeftSide>
        <RightSide>
          <HelpMe
            tripParent={tripParents[0] && tripParents[0].serviceGroup}
            isLoadingUser={isLoadingUser}
            user={user}
            tripId={tripId}
          />
          <OnlyOnDesktop>
            <Toggle onSwitch={changeShowTransport}>
              <PSmall>
                <Trans>Transports</Trans>
              </PSmall>
            </Toggle>
            <Toggle onSwitch={changeShowMap}>
              <PSmall>
                <Trans>Map</Trans>
              </PSmall>
            </Toggle>
          </OnlyOnDesktop>
        </RightSide>
      </Wrapper>
      <MapToggleMobile
        isShowing={showingMap}
        onClick={() => {
          changeShowMap(!showingMap);
          if (window.pageYOffset < 65) {
            window.scroll(0, 70);
          }
        }}
      >
        {showingMap && <CrossIcon />}
      </MapToggleMobile>
    </>
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
