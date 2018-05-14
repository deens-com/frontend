import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Rating from '../../shared_components/Rating';

const AvatarWrapper = styled.div`
  height: 30px;
  width: 30px;
`;

const TextWrapper = styled.div`
  padding-left: 18px;
`;

const WhiteText = styled.span`
  color: ${props => props.usernameColor};
`;

const Avatar = ({ user, usernameColor }) => {
  if (!user) return null;
  const dpUrl = (user.profilePicture && user.profilePicture.url) || 'https://imgur.com/download/4iTD3lS';
  const userProfilePageUrl = `/users/${user.username}`;
  return (
    <Grid columns={2} padded="horizontally" verticalAlign="middle">
      <Grid.Row>
        <Grid.Column width={3}>
          <Link to={userProfilePageUrl}>
            <AvatarWrapper>
              <Image src={dpUrl} circular />
            </AvatarWrapper>
          </Link>
        </Grid.Column>
        <Grid.Column width={13}>
          <TextWrapper>
            <Link to={userProfilePageUrl}>
              <WhiteText usernameColor={usernameColor} >{user.username}</WhiteText>
            </Link>
            <Rating rating={user.rating} />
          </TextWrapper>
        </Grid.Column>
      </Grid.Row>
    </Grid>
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
