import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { media } from 'libs/styled';
import SmartContractAddress from './SmartContractAddress';
import SmartContractAbi from './SmartContractAbi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${media.minMedium} {
    flex-direction: row;
  }
`;

const SmartContractDetails = ({ address, abi }) => {
  return (
    <Container>
      <SmartContractAddress address={address} />
      <SmartContractAbi abi={abi} />
    </Container>
  );
};

SmartContractDetails.propTypes = {
  address: PropTypes.string.isRequired,
  abi: PropTypes.string.isRequired,
};

export default SmartContractDetails;
