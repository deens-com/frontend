import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader, Popup } from 'semantic-ui-react';
import { P, PSmall } from 'libs/commonStyles';
import { primary } from 'libs/colors';
import { Settings } from 'shared_components/icons';
import Walk from 'assets/walk.svg';
import Bike from 'assets/bike.svg';
import Car from 'assets/car.svg';
import SadFace from 'assets/sad-face.svg';
import transportIcon from 'assets/service-icons/transport.svg';
import { getKmFromMeters } from 'libs/Utils';
import { secondsToHoursAndMinutes } from 'libs/trips';
import TextDivisor from 'shared_components/TextDivisor';

import { TripContext } from '../';

const Wrapper = styled.div`
  display: flex;
  margin-top: 40px;
`;

const TransportBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
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
`;

const BottomText = styled.div`
  text-align: ${props => (props.centered ? 'centered' : 'left')};
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
    cursor: pointer;
    color: ${primary};
  }
`;

const TimeAndDistance = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Icon = styled.img`
  margin: 30px auto 25px;
`;

function getIconAndText(data) {
  if (!data) {
    return {};
  }

  const notFound = { text: 'Oops! We could not find a route', icon: SadFace };

  if (!data.route) {
    return notFound;
  }

  switch (data.route.transportMode) {
    case 'walking':
      return { text: 'Go on foot', icon: Walk };
    case 'car':
      return { text: 'Drive your car', icon: Car };
    case 'bicycle':
      return { text: 'Ride a bike', icon: Bike };
    default:
      return notFound;
  }
}

const renderTime = time => {
  console.log('jeje', time);
  if (!time) {
    return null;
  }

  if (time.hours) {
    return `${time.hours}h ${time.minutes}mn`;
  }

  return `${time.minutes}mn`;
};

const Transportation = ({ children, serviceId, toService, selectTransport }) => {
  const isLoading = useContext(TripContext).isLoadingTransportation;
  const data = toService[serviceId];
  const { text, icon } = getIconAndText(data);
  const distance = getKmFromMeters(data && data.route && data.route.distanceInMeters);
  const time = secondsToHoursAndMinutes(data && data.route && data.route.baseTimeInSeconds);

  return (
    <Wrapper>
      <TransportBox>
        <Options>
          <img alt="Transportation" src={transportIcon} />
          <Popup
            trigger={
              <span>
                <Settings style={{ width: '20px', height: '20px' }} />
              </span>
            }
            content={
              <div>
                Change transport
                <button
                  onClick={() =>
                    selectTransport('car', toService[serviceId].fromServiceOrgId, serviceId)
                  }
                >
                  Car
                </button>
                <button
                  onClick={() =>
                    selectTransport('bicycle', toService[serviceId].fromServiceOrgId, serviceId)
                  }
                >
                  Bike
                </button>
                <button
                  onClick={() =>
                    selectTransport('walking', toService[serviceId].fromServiceOrgId, serviceId)
                  }
                >
                  Walk
                </button>
              </div>
            }
            on="click"
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
      {children}
    </Wrapper>
  );
};

export default Transportation;
