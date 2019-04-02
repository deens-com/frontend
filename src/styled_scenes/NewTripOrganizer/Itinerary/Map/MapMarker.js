import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { activity, accommodation, food } from 'libs/colors';
import { Activity, Food, Accommodation, ArrivalFlag, DepartureFlag } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import { P } from 'libs/commonStyles';
import { darkText } from 'libs/colors';

const Wrapper = styled.div`
  position: relative;
  bottom: 50px;
  left: -5px;
`;

const Element = styled.div`
  background-color: white;
  width: 30px;
  height: 30px;
  font-size: 20px;
  box-shadow: 2px 2px 10px 1px black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 5px 0;

  svg {
    color: ${props => props.color};
  }

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    margin-left: -0.5em;
    bottom: -10px;
    left: 19px;
    box-sizing: border-box;
    border: 5px solid;
    border-color: transparent transparent white white;
    transform-origin: 0 0;
    transform: scale(1, 2) rotate(115deg);
  }
`;

const Content = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px 10px;
  width: 280px;
  display: flex;
  position: relative;
  box-shadow: 0px 3px 3px 0 rgba(0, 0, 0, 0.4);
  left: -140px;
  bottom: 50px;
  height: 75px;
  color: ${darkText};
  z-index: 1;

  > p {
    margin-left: 10px;
    max-height: 50px;
    overflow: hidden;
  }

  svg {
    font-size: 20px;
    flex-shrink: 0;
    color: ${props => props.iconColor};
  }

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    margin-left: -0.25em;
    bottom: -1em;
    left: 50%;
    box-sizing: border-box;
    border: 0.5em solid black;
    border-color: transparent transparent white white;
    transform-origin: 0 0;
    transform: rotate(-45deg);
    box-shadow: -3px 3px 3px 0 rgba(0, 0, 0, 0.4);
  }
`;

const selectIconAndColorFromService = service => {
  if (!service.service.categories || service.service.categories.length === 0) {
    return {};
  }

  if (service.service.categories.find(category => category.names['en-us'] === 'Accommodation')) {
    return {
      Icon: Accommodation,
      color: accommodation,
    };
  }
  if (service.service.categories.find(category => category.names['en-us'] === 'Activity')) {
    return {
      Icon: Activity,
      color: activity,
    };
  }
  if (service.service.categories.find(category => category.names['en-us'] === 'Food')) {
    return {
      Icon: Food,
      color: food,
    };
  }

  return {};
};

const selectIconAndColorFromType = type => {
  if (type === 'initial') {
    return {
      Icon: DepartureFlag,
      color: null,
    };
  }
  return {
    Icon: ArrivalFlag,
    color: null,
  };
};

const getText = (type, service) => {
  if (type === 'initial') {
    return 'Your initial location';
  }

  if (type === 'finish') {
    return 'Your finish location';
  }
  return I18nText.translate(service.service.title);
};

const MapMarker = ({ service, type, coordinates, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      const onClickWhenOpen = e => {
        if (!boxRef.current.contains(e.target)) {
          setOpen(false);
        }
      };

      window.addEventListener('click', onClickWhenOpen);
      return () => {
        window.removeEventListener('click', onClickWhenOpen);
      };
    },
    [isOpen],
  );

  const { Icon, color } =
    type !== 'service' ? selectIconAndColorFromType(type) : selectIconAndColorFromService(service);

  return (
    <Wrapper {...props}>
      {isOpen ? (
        <Content iconColor={color} ref={boxRef}>
          <Icon />
          <P>{getText(type, service)}</P>
        </Content>
      ) : (
        <Element onClick={() => setOpen(true)} color={color}>
          <Icon />
        </Element>
      )}
    </Wrapper>
  );
};

MapMarker.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['service', 'initial', 'finish']),
  service: PropTypes.object,
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

MapMarker.defaultProps = {
  type: 'service',
  service: {},
  coordinate: {},
};

export default MapMarker;
