import React from 'react';
import styled from 'styled-components';

const TeaserContainer = styled.div`
  background: #FFC30B;
  color: white;
  font-size: 15px;
  padding: 10px;

  a {
    color: white;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const GlobalTeaser = () => {
  return (
    <TeaserContainer>
      Thank you for trying our <strong>demo</strong> website. We added <strong>sample data</strong> for Paris, London, New York & San Francisco, please try searching in these cities! <strong>You cannot book anything for real</strong>. If you use Ledger or Metamask, make sure to connect to <strong>Ropsten</strong>.&nbsp;
      <a href="https://vision.please.com" target="_blank" rel="noopener noreferrer">Learn more about Please</a>
    </TeaserContainer>
  );
};

export default GlobalTeaser;
