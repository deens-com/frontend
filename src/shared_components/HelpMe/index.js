import React from 'react';
import { Modal } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import analytics from 'libs/analytics';
import Content from './Content';

export default ({ tripId, session, tripParent, isLoadingUser, user }) => {
  return (
    <Modal
      style={{ maxWidth: '750px' }}
      trigger={
        <Button onClick={analytics.planning.brief.start} theme="fillLightGreen">
          Help me!
        </Button>
      }
      content={
        <Content
          tripParent={tripParent}
          isLoadingUser={isLoadingUser}
          user={user}
          tripId={tripId}
          session={session}
        />
      }
    />
  );
};
