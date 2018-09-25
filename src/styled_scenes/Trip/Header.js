import React, { Component } from 'react';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import { media } from 'libs/styled';
import I18nText from 'shared_components/I18nText';
import ImgurAvatar from 'assets/imgur-avatar.png';

const Wrapper = styled.div`
  width: 100%;
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.img});
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
  ${media.minMedium} {
    margin-top: -15px;
    height: 450px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  ${media.minMedium} {
    padding-top: 90px;
    font-size: 36px;
  }
`;

const AvatarWrapper = styled.div`
  width: 45px;
  height: 45px;
  margin: auto;
  margin-top: 25px;
`;

const CreatedBy = styled.p`
  font-size: 10px;
  line-height: 12px;
  margin-bottom: 0;
  margin-top: 12px;
`;

const Username = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
`;

const Header = ({ trip, owner }) => {
  const hero = trip.media.find(media => media.hero) || trip.media[0];
  const img = hero.files.hero ? hero.files.hero.url : trip.media.files.large.url;

  return (
    <Wrapper img={img}>
      <Title>
        <I18nText data={trip.title} />
      </Title>
      {owner && (
        <React.Fragment>
          <AvatarWrapper>
            <Image
              src={(owner.profilePicture && owner.profilePicture.url) || ImgurAvatar}
              circular
              width={45}
              height={45}
            />
          </AvatarWrapper>
          <CreatedBy>Created by</CreatedBy>
          <Username>{owner.username}</Username>
        </React.Fragment>
      )}
    </Wrapper>
  );
};

export default Header;
