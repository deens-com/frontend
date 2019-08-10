import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import mapServicesToDays from 'styled_scenes/Trip/mapServicesToDays';
import DayTitle from 'shared_components/DayTitle';
import I18nText from 'shared_components/I18nText';
import { getImageUrlFromFiles } from 'libs/media';
import { H4, P } from 'libs/commonStyles';
import { night } from 'libs/colors';

const Wrapper = styled.div`
  margin-bottom: 25px;
  display: flex;
  margin-top: 20px;
  border-radius: 10px;
  background: ${night};
  padding: 30px 20px;
  color: white;
`;

const Images = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`;

const ImageWrapper = styled.div`
  min-width: 85px;
  width: 85px;
  height: 100px;
  margin-right: 10px;
  grid-column: 2;
`;

const MainImageWrapper = styled.div`
  min-width: 275px;
  width: 275px;
  height: 325px;
  margin-right: 10px;
  grid-row: 1 / 4;
  grid-column: 1;
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Content = styled.div``;

export default ({ serviceOrg, services }) => {
  const service = services[serviceOrg.service];
  const mediaToShow = service.media.slice(1, 4);
  return (
    <Wrapper>
      <Images>
        <MainImageWrapper>
          {service.media[0] && (
            <Image alt={service.title} src={getImageUrlFromFiles(service.media[0].files)} />
          )}
        </MainImageWrapper>
        {mediaToShow.map((media, i) => (
          <ImageWrapper>
            <Image alt={service.title} src={getImageUrlFromFiles(media.files)} />
          </ImageWrapper>
        ))}
      </Images>
      <Content>
        <H4>{service.title}</H4>
        <P>{service.description}</P>
      </Content>
    </Wrapper>
  );
};
