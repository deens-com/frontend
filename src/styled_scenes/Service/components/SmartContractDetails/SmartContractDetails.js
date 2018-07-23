import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Accordion, Icon } from 'semantic-ui-react';

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

const Title = styled.h4`
  font-size: 22px;
`;

class SmartContractDetails extends Component {
  state = { activeIndex: -1 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { address, abi } = this.props;
    const { activeIndex } = this.state;
    if (!address) return null;
    return (
      <Accordion>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          <Title>
            <Icon name="dropdown" /> Smart Contract Information
          </Title>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Container>
            <SmartContractAddress address={address} />
            <SmartContractAbi address={address} abi={abi} />
          </Container>
        </Accordion.Content>
      </Accordion>
    );
  }
}

SmartContractDetails.propTypes = {
  address: PropTypes.string,
  abi: PropTypes.string,
};

export default SmartContractDetails;
