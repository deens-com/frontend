import React from 'react';
import PropTypes from 'prop-types';
import UserScene from './../../../styled_scenes/Users';
import { PageContent } from './../../../shared_components/layout/Page';

const UserComponent = props => {
  return (
    <PageContent padding="24px">
      <UserScene {...props} />
    </PageContent>
  );
};

UserComponent.propTypes = {
  user: PropTypes.object,
  servicesAvailed: PropTypes.array,
  tripsAndServicesOffered: PropTypes.array,
  givenReviews: PropTypes.array,
  receivedReviews: PropTypes.array,
};

export default UserComponent;
