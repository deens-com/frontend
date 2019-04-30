import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { waitUntilMapsLoaded } from 'libs/Utils';
import { mapDaysToServices } from 'styled_scenes/Trip/mapServicesToDays';
import { getFromCoordinates } from 'libs/Utils';
import { TripContext } from '../../';
import throttle from 'lodash.throttle';
import MapMarker from './MapMarker';
import Filters from './Filters';
import { generateDaysArray } from '../';
import { getCenterAndZoom } from 'libs/location';
import { media } from 'libs/styled';

const topMargin = 0;
const topOffset = 60 + 65; // when do we fix the map?
const bottomMargin = 70;
const bottomOffset = 245;

const getMapSize = () => {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2;
  const height =
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0) -
    (bottomMargin + topMargin);
  return { width, height };
};

const wrapperStyles = props => `
  display: ${props.display};
  height: calc(100vh - ${topMargin + bottomMargin}px);
  position: relative;
  order: 1;
  width: 50vw;
`;

const Wrapper = styled.div`
  ${wrapperStyles} z-index: 1;
  order: 0;
  width: 100vw;
  ${media.minSmall} {
    order: 1;
    width: 50vw;
    ${props =>
      props.position === 'fixed' &&
      `
      position: fixed;
      top: ${topMargin}px;
      right: 0;
    `};

    ${props =>
      props.position === 'absolute' &&
      `
      position: absolute;
      bottom: 0;
      right: 0;
    `};
  }
`;

const WrapperPlaceholder = styled.div`
  display: none;
  ${media.minSmall} {
    ${wrapperStyles};
  }
`;

function getMarkerProps(marker, i) {
  if (marker.service) {
    return {
      type: 'service',
      service: marker.service,
    };
  }
  if (i === 0) {
    return {
      type: 'initial',
      coordinates: marker,
    };
  }

  return {
    type: 'finish',
    coordinates: marker,
  };
}

function uniqServicesFilter(markers) {
  const servicesAdded = {};

  return markers.filter(marker => {
    if (!marker.service) {
      return true;
    }
    const key = marker.service.service._id;

    if (servicesAdded[key]) {
      return false;
    }

    servicesAdded[key] = true;
    return true;
  });
}

const isAccommodation = service =>
  service.categories.find(category => category.names['en-us'] === 'Accommodation');
const isActivity = service =>
  service.categories.find(category => category.names['en-us'] === 'Activity');
const isFood = service => service.categories.find(category => category.names['en-us'] === 'Food');

const getLocationMarker = (location, key) => ({
  key,
  ...getFromCoordinates(location),
});

const Map = ({ showingMap, servicesByDay, numberOfDays }) => {
  const { tripData, headerHeight } = useContext(TripContext);

  const [startLocation, setStartLocation] = useState(
    tripData.userStartLocation &&
      tripData.userStartLocation.geo &&
      tripData.userStartLocation.geo.coordinates,
  );
  const [endLocation, setEndLocation] = useState(
    tripData.userEndLocation &&
      tripData.userEndLocation.geo &&
      tripData.userEndLocation.geo.coordinates,
  );

  const [position, setPosition] = useState('relative');
  //const [services, setServices] = useState(mapDaysToServices(servicesByDay));
  const services = mapDaysToServices(servicesByDay);

  const mapStartLocation = getFromCoordinates(
    startLocation || (services[0] && services[0].service.location.geo.coordinates),
  ) || {
    lat: 45.4509449,
    lng: 4.9449656,
  };

  const servicesToMarkers = services.map(service => ({
    ...getFromCoordinates(service.service.location.geo.coordinates),
    key: service.service._id,
    service,
  }));

  const getMarkers = (uniqueServices = true) => [
    ...(startLocation ? [getLocationMarker(startLocation, 'startLocation')] : []),
    ...(uniqueServices ? uniqServicesFilter(servicesToMarkers) : servicesToMarkers),
    ...(endLocation ? [getLocationMarker(startLocation, 'endLocation')] : []),
  ];

  const [markers, setMarkers] = useState(getMarkers());

  const [zoom, setZoom] = useState(
    getCenterAndZoom(markers, mapStartLocation, 4, getMapSize()).zoom,
  );
  const [center, setCenter] = useState(
    getCenterAndZoom(markers, mapStartLocation, 4, getMapSize()).center,
  );

  const [filters, setFilters] = useState({
    accommodation: true,
    activity: true,
    food: true,
    days: generateDaysArray(numberOfDays).map(_ => true),
  });

  useEffect(
    () => {
      setFilters({
        ...filters,
        days: generateDaysArray(numberOfDays).map(_ => true),
      });
    },
    [numberOfDays],
  );

  useEffect(
    () => {
      const newMarkers = getMarkers(false);
      setMarkers(
        uniqServicesFilter(
          newMarkers.filter(marker => {
            if (!marker.service) {
              return true;
            }

            if (!filters.accommodation && isAccommodation(marker.service.service)) {
              return false;
            }

            if (!filters.activity && isActivity(marker.service.service)) {
              return false;
            }

            if (!filters.food && isFood(marker.service.service)) {
              return false;
            }

            if (!filters.days[marker.service.day - 1]) {
              return false;
            }

            return true;
          }),
        ),
      );
    },
    [filters],
  );

  useEffect(
    () => {
      const location =
        tripData.userStartLocation &&
        tripData.userStartLocation.geo &&
        tripData.userStartLocation.geo.coordinates;
      if (!location) {
        return;
      }
      const marker = getLocationMarker(location, 'startLocation');
      if (startLocation) {
        setMarkers([marker, ...markers.slice(1)]);
      } else {
        setMarkers([marker, ...markers]);
        setStartLocation(location);
      }
    },
    [tripData.userStartLocation],
  );

  useEffect(
    () => {
      const location =
        tripData.userEndLocation &&
        tripData.userEndLocation.geo &&
        tripData.userEndLocation.geo.coordinates;
      if (!location) {
        return;
      }
      const marker = getLocationMarker(location, 'endLocation');
      if (endLocation) {
        setMarkers([...markers.slice(0, markers.length - 1), marker]);
      } else {
        setMarkers([...markers, marker]);
        setEndLocation(location);
      }
    },
    [tripData.userEndLocation],
  );

  useEffect(
    () => {
      setMarkers(getMarkers());
    },
    [servicesByDay],
  );

  useEffect(
    () => {
      const handleScroll = () => {
        const fullHeight = document.body.scrollHeight;
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;

        const bottomDistance = bottomOffset + bottomMargin;

        if (scrolled + viewportHeight >= fullHeight - bottomDistance) {
          setPosition('absolute');
          return;
        }

        if (position !== 'fixed') {
          if (scrolled >= topOffset + headerHeight) {
            setPosition('fixed');
            return;
          }
          return;
        }
        if (position === 'fixed') {
          if (scrolled < topOffset + headerHeight) {
            setPosition('relative');
            return;
          }
          return;
        }

        if (scrolled + window.innerHeight < fullHeight - 105) {
          setPosition('fixed');
          return;
        }
      };

      const handleScrollThrottle = throttle(handleScroll, 10);

      window.addEventListener('scroll', handleScrollThrottle);
      return () => {
        window.removeEventListener('scroll', handleScrollThrottle);
      };
    },
    [position, headerHeight],
  );

  const display = showingMap ? 'block' : 'none';

  return (
    <>
      <Wrapper display={display} position={position}>
        <Filters defaultFilters={filters} setFilters={setFilters} />
        <GoogleMapReact
          center={center}
          zoom={zoom}
          bootstrapURLKeys={{
            key: 'AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc',
          }}
          googleMapLoader={waitUntilMapsLoaded}
          options={
            window.google && window.google.maps
              ? {
                  zoomControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_CENTER,
                  },
                }
              : {}
          }
        >
          {markers.map((marker, i) => (
            <MapMarker {...marker} {...getMarkerProps(marker, i)} scale={1} />
          ))}
        </GoogleMapReact>
      </Wrapper>
      {position !== 'relative' && <WrapperPlaceholder display={display} />}
    </>
  );
};

Map.propTypes = {
  display: PropTypes.bool,
};

Map.defaultProps = {
  display: false,
};

export default Map;
