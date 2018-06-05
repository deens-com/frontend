import React from 'react';
import PropTypes from 'prop-types';

import ExcerptCart from '../../../../shared_components/Carts/DetailCart/ExcerptCart';
import { Wrap, Header, DayTitle, DayTag, Mute } from './styles';
import { Cart as ServiceCard } from '../../../../shared_components/Carts/styles';
import EmptyTripDay from '../../../../styled_scenes/Trips/components/EmptyTripDay';

const TripDay = ({ dayIndex, services }) => {
  return (
    <Wrap>
      <Header>
        <DayTitle>
          <DayTag>Day {dayIndex}</DayTag>
          <Mute>2018-06-06</Mute>
        </DayTitle>
      </Header>
      {services.map(service => (
        <ServiceCard withShadow column key={service.objectId}>
          <ExcerptCart data={service} hideMoreInfo />
        </ServiceCard>
      ))}
      {services.length !== 0 ? null : <EmptyTripDay allowServiceRearrange={false} />}
    </Wrap>
  );
};

TripDay.propTypes = {
  dayIndex: PropTypes.number.isRequired,
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TripDay;
