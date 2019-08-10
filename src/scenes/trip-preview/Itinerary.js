import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateDaysArray } from 'styled_scenes/NewTripOrganizer/Itinerary';
import { minutesToDays } from 'libs/Utils';
import DayTitle from 'shared_components/DayTitle';
import I18nText from 'shared_components/I18nText';
import locationIcon from 'assets/location.svg';
import locationFinishIcon from 'assets/location-finish.svg';
import { getFirstCategoryLowerCase } from 'libs/categories';
import { getImageUrlFromFiles } from 'libs/media';
import Service from './Service';
import { P, H2 } from 'libs/commonStyles';
import { backgroundDark, backgroundLight } from 'libs/colors';
import { googleMapsKey } from 'libs/config';
import { uniqBy } from 'lodash';
import Transport from './Transport';

const DayWrapper = styled.div`
  margin-bottom: 25px;
  padding: 10px;
  background: ${backgroundLight};
  &:nth-child(odd) {
    background: ${backgroundDark};
  }
`;

const DayContent = styled.div`
  max-width: 1150px;
  margin: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const DayDescription = styled.div`
  display: flex;
`;

const Note = styled.div`
  flex: 1;
  margin-right: 10px;
`;

const Images = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
`;

const ImageWrapper = styled.div`
  width: 170px;
  height: 200px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  > img {
    margin-right: 10px;
    width: 50px;
  }
`;

function mapMediaToDays(media) {
  const result = {};
  media.forEach(currentMedia => {
    if (currentMedia.day) {
      result[currentMedia.day] = [
        ...(result[currentMedia.day] ? result[currentMedia.day] : []),
        currentMedia,
      ];
    }
  });
  return result;
}

function getLabel(num) {
  // Google Maps only allows A-Z0-9 single chars for labels
  // https://developers.google.com/maps/documentation/maps-static/dev-guide#Markers
  if (num > 35) {
    return '';
  }
  if (num < 10) {
    return num;
  }
  // 'A' is 65, and 10 -> A
  return String.fromCharCode(num + 55);
}

function parseMarkers(markers) {
  return markers
    .map(marker => `markers=color:0x097DA8%7Clabel:${marker.label}%7C${marker.coordinates}`)
    .join('&');
}

export default ({ trip, services, inDayServices, transports, showTransports }) => {
  const [days, setDays] = useState([]);
  const [imagesByDay, setImagesByDay] = useState({});
  const [markers, setMarkers] = useState([]);
  useEffect(
    () => {
      const numberOfDays = minutesToDays(trip.duration);
      setDays(generateDaysArray(numberOfDays, trip.services, inDayServices));
    },
    [trip.services, trip.duration, inDayServices],
  );
  useEffect(
    () => {
      setImagesByDay(mapMediaToDays(trip.media));
    },
    [trip.media],
  );
  let serviceNumber = 0;

  useEffect(
    () => {
      const uniqueServices = uniqBy(trip.services, serviceOrg => inDayServices[serviceOrg].service);
      // order is supposed to be the same that the one we show next to the service
      // I could not make further checks on this but I'm pretty sure it works
      setMarkers(
        uniqueServices.map((serviceOrg, i) => {
          const service = services[inDayServices[serviceOrg].service];
          return {
            label: i + 1,
            coordinates: `${service.location.geo.coordinates[1]},${
              service.location.geo.coordinates[0]
            }`,
          };
        }),
      );
    },
    [inDayServices, trip.services, services],
  );

  return (
    <>
      {days.map((day, i) => {
        const dayNumber = i + 1;
        const note = I18nText.translate(trip.notes && trip.notes[dayNumber]);
        const isLastDay = dayNumber === minutesToDays(trip.duration);
        return (
          <DayWrapper key={dayNumber}>
            <DayContent>
              <TitleWrapper>
                <DayTitle day={dayNumber} tripStartDate={trip.startDate} />
              </TitleWrapper>
              <DayDescription>
                {note && <Note>{note}</Note>}
                {imagesByDay[dayNumber] && (
                  <Images>
                    {imagesByDay[dayNumber].map(img => (
                      <ImageWrapper>
                        <Image alt={`Day ${dayNumber}`} src={getImageUrlFromFiles(img.files)} />
                      </ImageWrapper>
                    ))}
                  </Images>
                )}
              </DayDescription>
              {dayNumber === 1 &&
                trip.userStartLocation && (
                  <Location>
                    <img alt="Start location" src={locationIcon} />
                    <P>{trip.userStartLocation.formattedAddress}</P>
                  </Location>
                )}
              {day.services.map((service, serviceIndex) => {
                const transportKey = `${service._id}`;
                const transportKeyFinal =
                  isLastDay && serviceIndex + 1 === day.services.length && `last:${service._id}`;
                const notFound = !transports[transportKey] || !transports[transportKey].route;
                const notFoundFinal =
                  !transportKeyFinal ||
                  !transports[transportKeyFinal] ||
                  !transports[transportKeyFinal].route;
                const evenDay = dayNumber % 2 === 0;
                return (
                  <React.Fragment key={service._id}>
                    {!notFound ? (
                      <>
                        {showTransports && (
                          <Transport evenDay={evenDay} data={transports[transportKey]} />
                        )}
                        <Service
                          serviceNumber={
                            getFirstCategoryLowerCase(services[service.service].categories) !==
                              'accommodation' && getLabel(++serviceNumber)
                          }
                          serviceOrg={service}
                          services={services}
                        />
                        {showTransports &&
                          !notFoundFinal && (
                            <Transport evenDay={evenDay} data={transports[transportKeyFinal]} />
                          )}
                      </>
                    ) : null}
                  </React.Fragment>
                );
              })}
              {isLastDay &&
                trip.userEndLocation && (
                  <Location>
                    <img alt="End location" src={locationFinishIcon} />
                    <P>{trip.userStartLocation.formattedAddress}</P>
                  </Location>
                )}
            </DayContent>
          </DayWrapper>
        );
      })}
      <div style={{ margin: 'auto', width: '100%', maxWidth: 1150 }}>
        <H2>Itinerary map</H2>
        <img
          alt="Itinerary map"
          src={`https://maps.googleapis.com/maps/api/staticmap?size=575x500&scale=2&${parseMarkers(
            markers,
          )}&key=${googleMapsKey}`}
        />
      </div>
    </>
  );
};
