import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SectionWrap } from '../../../shared_components/layout/Page';

const SubTitle = styled.p`
  color: #a3a9b2;
`;

const StatusAndBio = ({ user = {} }) => {
  return (
    <div>
      {user.bio && (
        <SectionWrap>
          <SubTitle>{user.bio}</SubTitle>
        </SectionWrap>
      )}
    </div>
  );
};

StatusAndBio.propTypes = {
  user: PropTypes.object,
};

export default StatusAndBio;
