import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import CircularProfilePic from './CircularProfilePic';
import moment from 'moment';
import ImgurAvatar from "./../../../assets/imgur-avatar.png";

const BodyText = styled.p`
  font-weight: 500;
`;
const AttributeTitle = styled.h6`
  font-size: 9px;
  color: #a3a9b2;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

const Wrapper = styled.div`
  text-align: center;
`;

const NameDiv = styled.div`
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  font-size: 24px;
  font-weight: 600;
`;

const formatDate = date => moment(date).format('MMMM YYYY');

const UserBasicInfo = ({ user = {} }) => {
  const name = user.fullName || user.username;
  // TODO: upload the image on our own infra
  const dpUrl = (user.profilePicture && user.profilePicture.url) || ImgurAvatar;
  const userLevel = user.userLevel || 'New user';
  return (
    <Wrapper>
      <CenteredDiv>
        <CircularProfilePic src={dpUrl} />
        {name && <NameDiv>{name}</NameDiv>}
      </CenteredDiv>

      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              <AttributeTitle>MEMBER SINCE</AttributeTitle>
              {user.createdAt && <BodyText>{formatDate(user.createdAt)}</BodyText>}
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div>
              <AttributeTitle>USER LEVEL</AttributeTitle>
              <BodyText>
                <Icon fitted name="star" style={{ color: '#4fb798' }} /> {userLevel}
              </BodyText>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

UserBasicInfo.propTypes = {
  user: PropTypes.object,
};

export default UserBasicInfo;
