import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Popup from 'shared_components/Popup';
import { P, PSmall } from 'libs/commonStyles';
import { primary, secondary, primaryHover, backgroundDark, backgroundLight } from 'libs/colors';
import Settings from 'shared_components/icons/Settings';
import Walk from 'assets/walk.svg';
import Bike from 'assets/bike.svg';
import Car from 'assets/car.svg';
import Train from 'assets/train.svg';
import SadFace from 'assets/sad-face.svg';
import { getKmFromMeters } from 'libs/Utils';
import { secondsToHoursAndMinutes } from 'libs/trips';
import { media } from 'libs/styled';
import TextDivisor from 'shared_components/TextDivisor';
import CarIcon from 'shared_components/icons/Car';
import WalkIcon from 'shared_components/icons/Walk';
import BikeIcon from 'shared_components/icons/Bike';
import TrainIcon from 'shared_components/icons/Train';

import { TripContext } from '../';

// i18n
import { Trans } from '@lingui/macro';

const TransportBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 15px;
  ${media.minLargePlus} {
    margin-top: 40px;
  }
`;

// height: 225px;
const TransportContent = styled.div`
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  height: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 5px 4px;
  z-index: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  ${media.minLargePlus} {
    display: block;
    width: 130px;
    height: 182px;
    padding: 0 4px;
  }
`;

const BottomText = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  ${media.minLargePlus} {
    display: block;
    text-align: ${props => (props.centered ? 'centered' : 'left')};
  }
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

const IconSpan = styled.span`
  border-radius: 0 0 0 5px;
  background-color: ${backgroundLight};
  padding: 3px 3px 3px 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  border-left: 1px solid ${backgroundDark};
  font-size: 16px;

  ${media.minLargePlus} {
    border-left: 0;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
  }
`;

const TimeAndDistance = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-style: italic;
  margin-left: auto;
  ${media.minLargePlus} {
    margin-left: initial;
  }
`;

const Icon = styled.img`
  margin: 5px 0;
  ${media.minLargePlus} {
    margin: 30px auto 25px;
  }
`;

const TransportSteps = styled.ol`
  padding: 15px;
  padding-bottom: 5px;
  list-style: none;
  counter-reset: li;
  > li {
    margin-bottom: 5px;
    counter-increment: li;
    &::before {
      content: counter(li);
      color: ${primary};
      display: inline-block;
      width: 1.5em;
      margin-left: -2em;
      margin-right: 0.5em;
      text-align: right;
      direction: rtl;
    }
  }
`;

function getIconAndText(data) {
  const notFound = { text: 'Oops! We could not find a route', icon: SadFace };

  if (!data || !data.route) {
    return notFound;
  }

  switch (data.route.transportMode) {
    case 'walking':
      return { text: 'Walk', icon: Walk };
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

const renderSteps = data => {
  if (!data || !data.route || !data.route.steps) {
    return null;
  }
  return (
    <TransportSteps>
      {data.route.steps.map(step => (
        <li key={step.key}>{step.text}</li>
      ))}
    </TransportSteps>
  );
};

const Transportation = ({
  children,
  serviceId,
  selectTransport,
  isFirst,
  isLast,
  currentTransport,
}) => {
  const context = useContext(TripContext);
  const isLoading = context.isLoadingTransportation;
  const showingTransports = context.showingTransports;
  const [isShowingTooltip, setShowingTooltip] = useState(false);
  const data = currentTransport;
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

    selectTransport(
      selectedTransport,
      currentTransport.fromServiceOrgId || currentTransport.fromServiceOrganizationId,
      currentTransport.toServiceOrgId || currentTransport.toServiceOrganizationId,
      position,
    );
    hideTooltip();
  };

  return (
    <>
      <div>
        <TransportBox>
          <TransportContent>
            {isLoading ? (
              <Loader active />
            ) : (
              <>
                <Icon src={icon} />
                <BottomText centered={!data || !data.route}>
                  <P style={{ marginRight: '5px' }}>
                    {selected === 'public-transit' ? (
                      <Popup
                        position="bottom center"
                        trigger={<span style={{ cursor: 'pointer', color: primary }}>{text}</span>}
                        on="click"
                      >
                        {renderSteps(data)}
                      </Popup>
                    ) : (
                      text
                    )}
                  </P>
                  {data &&
                    data.route && (
                      <TimeAndDistance>
                        <PSmall>{renderTime(time)}</PSmall>
                        <TextDivisor />
                        <PSmall>
                          {distance}
                          <Trans>km</Trans>
                        </PSmall>
                      </TimeAndDistance>
                    )}
                </BottomText>
              </>
            )}
            <Popup
              trigger={
                <IconSpan>
                  <Settings style={{ color: primary }} />
                </IconSpan>
              }
              content={
                <div>
                  <P style={{ color: secondary }}>
                    <Trans>Change transport</Trans>
                  </P>
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
          </TransportContent>
        </TransportBox>
      </div>
      {children}
    </>
  );
};

export default Transportation;
