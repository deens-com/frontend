import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ExcerptCart from '../../../../shared_components/Carts/DetailCart/ExcerptCart';
import { Wrap, Header, DayTitle, DayTag, Mute } from './styles';
import { Cart as ServiceCard } from '../../../../shared_components/Carts/styles';
import EmptyTripDay from '../../../../styled_scenes/Trips/components/EmptyTripDay';
import { getISODateString } from '../../../../libs/Utils';

const TripDay = ({ dayIndex, services, tripBeginDate }) => {
  return (
    <Wrap>
      <Header>
        <DayTitle>
          <DayTag>Day {dayIndex}</DayTag>
          <Mute>
            {moment(getISODateString(tripBeginDate))
              .add(dayIndex - 1, 'days')
              .format('Do MMM YYYY')}
          </Mute>
        </DayTitle>
      </Header>
      {services.map(service => (
        <ServiceCard withShadow column key={service.objectId}>
          <ExcerptCart data={service} hideMoreInfo isOwner={false} />
        </ServiceCard>
      ))}
      {services.length !== 0 ? null : <EmptyTripDay allowServiceRearrange={false} />}
    </Wrap>
  );
};

TripDay.propTypes = {
  tripBeginDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ iso: PropTypes.string })])
    .isRequired,
  dayIndex: PropTypes.number.isRequired,
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TripDay;
