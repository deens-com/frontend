import React from 'react';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import { media } from 'libs/styled';
import { Link } from 'react-router-dom';
import I18nText from 'shared_components/I18nText';
import ImgurAvatar from 'assets/no-avatar.png';
import { getHeroImageUrlFromMedia } from 'libs/media';
import { buildImgUrl } from 'libs/Utils';
import urls from 'libs/urlGenerator';

// i18n
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  width: 100%;
  background-image: linear-gradient(0, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${props => props.img});
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
  height: 350px;
  margin-top: -20px;
  ${media.minMedium} {
    height: 450px;
    margin-top: -15px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  padding-top: 45px;
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

const Header = ({ trip, owner, innerRef }) => {
  const hero = trip && getHeroImageUrlFromMedia(trip.media);
  const img = buildImgUrl(hero);

  const ownerImage =
    (owner &&
      owner.profilePicture &&
      buildImgUrl(owner.profilePicture, { circular: true, width: 45, height: 45 })) ||
    ImgurAvatar;
  return (
    <Wrapper ref={innerRef} img={img}>
      <Title>
        <I18nText data={trip.title} />
      </Title>
      {owner && (
        <React.Fragment>
          <AvatarWrapper>
            <Link to={urls.user.view(owner.username)}>
              <Image src={ownerImage} circular width={45} height={45} />
            </Link>
          </AvatarWrapper>
          <CreatedBy>
            <Trans>Created by</Trans>{' '}
          </CreatedBy>
          <Username>
            <Link to={urls.user.view(owner.username)}>{owner.username}</Link>
          </Username>
        </React.Fragment>
      )}
    </Wrapper>
  );
};

export default Header;
