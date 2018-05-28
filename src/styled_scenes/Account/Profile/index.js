import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Divider, Icon } from 'semantic-ui-react';
import styled from "styled-components";
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';

const HorizontalSpan = styled.span`
  display: flex;
  flexDirection: row;
`;

const BoldH4 = styled.h4`
  font-weight: bold;
`;

const AccountProfileScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <h2>Profile Scene</h2>
        <Divider />
        <HorizontalSpan>
          <BoldH4>Bio :</BoldH4>
          <p>&nbsp;{props.user_profile.biography}</p>&nbsp;<Icon disabled name='pencil' />
        </HorizontalSpan>
        <HorizontalSpan>
          <BoldH4>Username :</BoldH4>
          <p>&nbsp;{props.user_profile.username}</p>&nbsp;<Icon disabled name='pencil' />
        </HorizontalSpan>
        <HorizontalSpan>
          <BoldH4>Email :</BoldH4>
          <p>&nbsp;{props.user_profile.email}</p>&nbsp;<Icon disabled name='pencil' />
        </HorizontalSpan>
      </Grid.Column>
    </Grid>
  );
};

AccountProfileScene.propTypes = {
  user: PropTypes.object,
};

export default AccountProfileScene;
