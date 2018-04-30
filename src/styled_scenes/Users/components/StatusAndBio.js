import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SectionWrap } from '../../../shared_components/layout/Page';

const Title = styled.p`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  color: #a3a9b2;
`;

const StatusAndBio = props => {
  return (
    <SectionWrap>
      <Title>Hey, I'm Nick from New York! 🤠</Title>
      <SubTitle>Welcome! I enjoy meeting new people, doing sports outside and eating pizza</SubTitle>
    </SectionWrap>
  );
};

export default StatusAndBio;
