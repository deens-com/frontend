import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SectionWrap } from '../../../shared_components/layout/Page';

const SubTitle = styled.p`
  color: #a3a9b2;
`;

const StatusAndBio = ({ user = {} }) => {
  return (
    <SectionWrap>
      {user.bio && <SubTitle>{user.bio}</SubTitle>}
    </SectionWrap>
  );
};

StatusAndBio.propTypes = {
  user: PropTypes.object,
};

export default StatusAndBio;
