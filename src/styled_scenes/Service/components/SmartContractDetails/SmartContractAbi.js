import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import { CellContainer, Header, Body } from './styles';

const SmartContractAbi = ({ abi }) => {
  return (
    <CellContainer>
      <Header>
        <Icon name="code" />Smart Contract ABI
      </Header>
      <Body>
        <Button color="grey" size="mini">
          Show ABI
        </Button>
      </Body>
    </CellContainer>
  );
};

SmartContractAbi.propTypes = {
  abi: PropTypes.string.isRequired,
};

export default SmartContractAbi;
