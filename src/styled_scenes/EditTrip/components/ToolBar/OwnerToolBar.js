import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EditTripForm from './EditTripForm';
import { ContextConsumer } from 'scenes/trips/context';
import { media } from 'libs/styled';

const Wrap = styled.div`
  padding: 10px;

  ${media.minMedium} {
    padding: 25px;
  }
`;

const OwnerToolBar = ({ trip }) => {
  return (
    <Wrap>
      <ContextConsumer>
        {({ updateTripDetails }) => <EditTripForm trip={trip} onSubmit={updateTripDetails} />}
      </ContextConsumer>
    </Wrap>
  );
};

OwnerToolBar.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default OwnerToolBar;
