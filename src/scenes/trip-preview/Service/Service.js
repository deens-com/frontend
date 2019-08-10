import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import mapServicesToDays from 'styled_scenes/Trip/mapServicesToDays';
import DayTitle from 'shared_components/DayTitle';
import I18nText from 'shared_components/I18nText';
import { getImageUrlFromMedia } from 'libs/media';
import { H4, P } from 'libs/commonStyles';
import { primary } from 'libs/colors';

const Wrapper = styled.div`
  margin-bottom: 25px;
  display: flex;
  margin-top: 20px;
  padding-left: 45px;
`;

const ImageWrapper = styled.div`
  min-width: 170px;
  width: 170px;
  height: 200px;
  margin-right: 10px;
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Content = styled.div``;

const Number = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: ${primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -40px;
  margin-top: 75px;
`;

export default ({ serviceOrg, services, serviceNumber }) => {
  const service = services[serviceOrg.service];
  const img = getImageUrlFromMedia(service.media);
  return (
    <Wrapper>
      <Number>{serviceNumber}</Number>
      <ImageWrapper>
        <Image alt={service.title} src={img} />
      </ImageWrapper>
      <Content>
        <H4>{service.title}</H4>
        <P>{service.description}</P>
      </Content>
    </Wrapper>
  );
};
