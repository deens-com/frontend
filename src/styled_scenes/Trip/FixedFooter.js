import React, { Component } from 'react';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import ImgurAvatar from 'assets/imgur-avatar.png';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  height: 65px;
  display: flex;
  align-items: center;
  bottom: 0;
  justify-content: flex-end;
`;

const FixedFooter = ({}) => {
  return <Wrapper>hola jeje</Wrapper>;
};

export default FixedFooter;
