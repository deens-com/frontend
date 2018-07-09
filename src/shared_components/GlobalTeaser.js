import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react'

const TeaserContainer = styled.div`
  background: #FFC30B;
  color: white;
  font-size: 15px;
  padding: 10px 50px 10px 10px;

  a {
    color: white;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const GlobalTeaser = () => {
  return (
    <TeaserContainer>
      Thank you for trying our <strong>demo</strong> website. We added <strong>sample data</strong> for
      &nbsp;<a href="/#/results?service_types=food&latitude=48.856614&longitude=2.3522219000000177">Paris</a>,
      &nbsp;<a href="/#/results?latitude=51.5073509&longitude=-0.1277583">London</a>,
      &nbsp;<a href="/#/results?latitude=40.7127753&longitude=-74.0059728">New York</a> and
      &nbsp;<a href="/#/results?latitude=37.7749295&longitude=-122.4194155">San Francisco</a>, please try searching in these cities! <strong>You cannot book anything for real</strong>. If you use Ledger or Metamask, make sure to connect to <strong>Ropsten test network</strong>.&nbsp;
      <a href="https://vision.please.com" target="_blank" rel="noopener noreferrer">Learn more about Please</a>

      <CloseButton>
        <Icon link name='close' size='large'/>
      </CloseButton>
    </TeaserContainer>
  );
};

export default GlobalTeaser;
