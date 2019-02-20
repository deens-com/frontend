import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import UserBasicInfo from './components/UserBasicInfo';
import StatusAndBio from './components/StatusAndBio';
import UsersTripsServices from './components/UsersTripsServices';
import { SectionWrap } from '../../shared_components/layout/Page';
import Reviews from 'shared_components/Reviews';
import ListsHandler from 'shared_components/ListsHandler';
import api from 'libs/apiClient';

function mapReviewerIntoReview(items, data) {
  return items.map(item => {
    return {
      ...item,
      reviewer: data.users.find(user => user._id === item.reviewer),
    };
  });
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Title = styled.h1``;

const UserScene = ({ user = {}, tripsBooked = [], tripsAndServicesOffered = [] }) => {
  return (
    <Wrapper>
      <Grid centered columns={2}>
        <Grid.Column mobile={16} tablet={5} computer={4}>
          <SectionWrap>
            <UserBasicInfo user={user} />
          </SectionWrap>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={11} computer={12}>
          <StatusAndBio user={user} />
          <Title>Reviews given to the user</Title>
          {user &&
            user.username && (
              <ListsHandler
                itemKey="reviews"
                apiFunction={api.reviews.username.users.received.get}
                urlParams={{
                  username: user.username,
                }}
                haveIncludes={['user']}
                mapIncludes={mapReviewerIntoReview}
                render={({ items, fetchMore, totalCount, isLoading }) => (
                  <Reviews
                    reviews={items}
                    fetchMore={fetchMore}
                    totalCount={totalCount}
                    isLoading={isLoading}
                    emptyText="This user has not been rated yet."
                    userKey="reviewer"
                  />
                )}
              />
            )}
          {tripsAndServicesOffered.length > 0 && (
            <UsersTripsServices items={tripsAndServicesOffered} title="My trips and services" />
          )}
          <Title>Reviews given by the user</Title>
          {user &&
            user.username && (
              <ListsHandler
                itemKey="reviews"
                apiFunction={api.users.username.reviews.get}
                urlParams={{
                  username: user.username,
                }}
                haveIncludes={['service']}
                /*showLoader={false}*/
                render={({ items, fetchMore, totalCount, isLoading }) => (
                  <Reviews
                    reviews={items}
                    fetchMore={fetchMore}
                    totalCount={totalCount}
                    isLoading={isLoading}
                    emptyText="This user has not reviewed anything yet."
                    showServiceInsteadOfUser
                  />
                )}
              />
            )}
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};

UserScene.propTypes = {
  user: PropTypes.object,
  tripsBooked: PropTypes.array,
  tripsAndServicesOffered: PropTypes.array,
  givenReviews: PropTypes.array,
  receivedReviews: PropTypes.array,
};

export default UserScene;
