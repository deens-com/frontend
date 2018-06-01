import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { SectionWrap } from './../../../shared_components/layout/Page';
import UserBasicInfo from './../components/UserBasicInfo';
import ServicesList from './ServicesList';

const Title = styled.h1`
  float: left;
`;

const AccountServicesScene = props => {
  return (
    <Grid centered columns={2}>
      <Grid.Column mobile={16} tablet={5} computer={4}>
        <SectionWrap>
          <UserBasicInfo {...props} />
        </SectionWrap>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={11} computer={12}>
        <Title>My Services</Title>
        <Link to="/services/new">
          <Button color="teal" style={{'float': 'right'}}>Add Service</Button>
        </Link>
        <ServicesList {...props} />
      </Grid.Column>
    </Grid>
  );
};

AccountServicesScene.propTypes = {
  user: PropTypes.object,
  user_services: PropTypes.array
};

export default AccountServicesScene;
