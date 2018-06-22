import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

import { CellContainer, Header, Body } from './styles';
import { media } from 'libs/styled';

const Container = styled(CellContainer)`
  ${media.minMedium} {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

const SmartContractAddress = ({ address }) => {
  return (
    <Container>
      <Header>
        <Icon name="address card outline" /> Address
      </Header>
      <Body>
        <code>{address}</code>&nbsp;
        <a href={`https://ropsten.etherscan.io/address/${address}`}>
          <Icon name="external" />
        </a>
      </Body>
    </Container>
  );
};

SmartContractAddress.propTypes = {
  address: PropTypes.string.isRequired,
};

export default SmartContractAddress;
