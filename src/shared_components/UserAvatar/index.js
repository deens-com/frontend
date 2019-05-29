import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import Rating from '../../shared_components/Rating';
import ImgurAvatar from './../../assets/no-avatar.png';
import { buildImgUrl } from 'libs/Utils';

const AvatarWrapper = styled.div`
  height: 30px;
  width: 30px;
`;

const WhiteText = styled.span`
  color: ${props => props.usernameColor};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
`;

const ImageElement = styled.div`
  grid-row-start: 1;
  grid-row-end: 3;
`;

const Avatar = ({ user, usernameColor }) => {
  if (!user) return null;
  const dpUrl =
    (user.profilePicture &&
      buildImgUrl(user.profilePicture, { circular: true, width: 30, height: 30 })) ||
    ImgurAvatar;
  //const userProfilePageUrl = `/users/${user.username}`;
  return (
    <GridContainer>
      <ImageElement>
        <AvatarWrapper>
          <Image src={dpUrl} circular width={30} height={30} />
        </AvatarWrapper>
      </ImageElement>
      <WhiteText usernameColor={usernameColor}>{user.username}</WhiteText>
      {user.rating !== undefined && <Rating rating={user.rating} />}
    </GridContainer>
  );
};

Avatar.propTypes = {
  user: PropTypes.object,
  usernameColor: PropTypes.string,
};

Avatar.defaultProps = {
  user: null,
  usernameColor: '#3c434b',
};

export default Avatar;
