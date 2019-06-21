import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader, Popup } from 'semantic-ui-react';
import { P, PSmall } from 'libs/commonStyles';
import { primary, secondary, primaryHover, disabled, tertiaryContrast } from 'libs/colors';
import Settings from 'shared_components/icons/Settings';
import Walk from 'assets/walk.svg';
import Bike from 'assets/bike.svg';
import Car from 'assets/car.svg';
import Train from 'assets/train.svg';
import SadFace from 'assets/sad-face.svg';
import transportIcon from 'assets/service-icons/transport.svg';
import { getKmFromMeters } from 'libs/Utils';
import { secondsToHoursAndMinutes } from 'libs/trips';
import TextDivisor from 'shared_components/TextDivisor';
import CarIcon from 'shared_components/icons/Car';
import WalkIcon from 'shared_components/icons/Walk';
import BikeIcon from 'shared_components/icons/Bike';
import TrainIcon from 'shared_components/icons/Train';

import { TripContext } from '../';

const TransportBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 40px;
`;

// height: 225px;
const TransportContent = styled.div`
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  width: 130px;
  height: 182px;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 0 4px;
  z-index: 0;
`;

const BottomText = styled.div`
  text-align: ${props => (props.centered ? 'centered' : 'left')};
`;

const TransportOptions = styled.div`
  display: flex;
`;

const TransportSelect = styled.button`
  border: 0;
  outline: 0;
  width: 35px;
  height: 35px;
  border-radius: 5px 5px 5px 0;
  background-color: ${props => (props.selected ? primary : 'white')};
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-left: 10px;
  cursor: ${props => (props.selected ? 'initial' : 'pointer')};
  > svg {
    color: ${props => (props.selected ? 'white' : primary)};
    margin: auto;
  }
  &:hover {
    background-color: ${props => (props.selected ? primary : primaryHover)};
    > svg {
      color: white;
    }
  }
  &:focus {
    outline: 0;
    border: 0;
  }
  &:first-child {
    margin-left: 0;
  }
`;

const Options = styled.div`
  position: relative;
  display: flex;
  height: 35px;
  border-radius: 5px 5px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 0;
  box-shadow: 1px 0 rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 8px;
  margin: 0 auto;
  align-items: center;
  svg {
    margin-left: 15px;
    cursor: ${props => (props.isLoading ? 'initial' : 'pointer')};
    color: ${props => (props.isLoading ? disabled : primary)};
  }
`;

const TimeAndDistance = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-style: italic;
`;

const Icon = styled.img`
  margin: 30px auto 25px;
`;

function getIconAndText(data) {
  const notFound = { text: 'Oops! We could not find a route', icon: SadFace };

  if (!data || !data.route) {
    return notFound;
  }

  switch (data.route.transportMode) {
    case 'walking':
      return { text: 'Go on foot', icon: Walk };
    case 'car':
      return { text: 'Drive your car', icon: Car };
    case 'bicycle':
      return { text: 'Ride a bike', icon: Bike };
    case 'public-transit':
      return { text: 'Public transport', icon: Train };
    default:
      return notFound;
  }
}

const renderTime = time => {
  if (!time) {
    return null;
  }

  if (time.hours) {
    return `${time.hours}h ${time.minutes}mn`;
  }

  return `${time.minutes}mn`;
};

const Transportation = ({
  children,
  serviceId,
  toService,
  fromService,
  selectTransport,
  isFirst,
  isLast,
  overrideData,
}) => {
  const context = useContext(TripContext);
  const isLoading = context.isLoadingTransportation;
  const showingTransports = context.showingTransports;
  const [isShowingTooltip, setShowingTooltip] = useState(false);
  const data = overrideData ? overrideData : toService[serviceId];
  const { text, icon } = getIconAndText(data);
  const distance = getKmFromMeters(data && data.route && data.route.distanceInMeters);
  const time = secondsToHoursAndMinutes(data && data.route && data.route.baseTimeInSeconds);
  const selected = data && data.route && data.route.transportMode;

  const showTooltip = () => {
    if (isLoading) {
      return;
    }
    setShowingTooltip(true);
  };
  const hideTooltip = () => setShowingTooltip(false);

  if (!showingTransports) {
    return children || null;
  }

  let position = 'middle';
  if (isFirst) {
    position = 'first';
  } else if (isLast) {
    position = 'last';
  }

  const onTransportSelect = selectedTransport => {
    if (selected === selectedTransport) {
      return;
    }
    const serviceDictionary = isLast ? fromService : toService;

    selectTransport(
      selectedTransport,
      isFirst ? undefined : serviceDictionary[serviceId].fromServiceOrgId,
      isLast ? undefined : serviceId,
      position,
    );
    hideTooltip();
  };

  return (
    <>
      <div>
        <TransportBox>
          <Options isLoading={isLoading}>
            <img alt="Transportation" src={transportIcon} />
            <Popup
              trigger={
                <span>
                  <Settings style={{ width: '20px', height: '20px' }} />
                </span>
              }
              content={
                <div>
                  <P style={{ color: secondary }}>Change transport</P>
                  <TransportOptions>
                    <TransportSelect
                      selected={selected === 'car'}
                      onClick={() => onTransportSelect('car')}
                    >
                      <CarIcon />
                    </TransportSelect>
                    <TransportSelect
                      selected={selected === 'bicycle'}
                      onClick={() => onTransportSelect('bicycle')}
                    >
                      <BikeIcon />
                    </TransportSelect>
                    <TransportSelect
                      selected={selected === 'walking'}
                      onClick={() => onTransportSelect('walking')}
                    >
                      <WalkIcon />
                    </TransportSelect>
                    <TransportSelect
                      selected={selected === 'public-transit'}
                      onClick={() => onTransportSelect('public-transit')}
                    >
                      <TrainIcon />
                    </TransportSelect>
                  </TransportOptions>
                </div>
              }
              on="click"
              open={isShowingTooltip}
              onOpen={showTooltip}
              onClose={hideTooltip}
              hideOnScroll
            />
          </Options>
          <TransportContent>
            {isLoading ? (
              <Loader active />
            ) : (
              <>
                <Icon src={icon} />
                <BottomText centered={!data || !data.route}>
                  <P>{text}</P>
                  {data &&
                    data.route && (
                      <TimeAndDistance>
                        <PSmall>{renderTime(time)}</PSmall>
                        <TextDivisor />
                        <PSmall>
                          {distance}
                          km
                        </PSmall>
                      </TimeAndDistance>
                    )}
                </BottomText>
              </>
            )}
          </TransportContent>
        </TransportBox>
      </div>
      {children}
    </>
  );
};

export default Transportation;
