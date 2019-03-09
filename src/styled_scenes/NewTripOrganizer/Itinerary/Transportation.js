import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';

import { TripContext } from '../';

const Wrapper = styled.div`
  display: flex;
`;

const TransportBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TransportContent = styled.div`
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  width: 130px;
  height: 225px;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
`;

const Options = styled.div`
  display: flex;
  height: 35px;
  border-radius: 5px 5px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 0;
  box-shadow: 1px 0 rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 8px;
  margin: auto;
`;

const Transportation = ({ children, serviceId, toService }) => {
  const isLoading = useContext(TripContext).isLoadingTransportation;
  return (
    <Wrapper>
      <TransportBox>
        <Options>arre</Options>
        <TransportContent>{isLoading ? <Loader active /> : <div>arre</div>}</TransportContent>
      </TransportBox>
      {children}
    </Wrapper>
  );
};

export default Transportation;
