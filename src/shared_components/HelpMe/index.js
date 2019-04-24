import React from 'react';
import { Modal } from 'semantic-ui-react';
import Button from 'shared_components/Button';
import analytics from 'libs/analytics';
import Content from './Content';

export default ({ tripId, session, tripParent, isLoadingUser, user, buttonSize }) => {
  return (
    <Modal
      style={{ maxWidth: '720px', marginTop: '85px !important' }}
      trigger={
        <Button onClick={analytics.planning.brief.start} theme="fillLightGreen" size={buttonSize}>
          Help me!
        </Button>
      }
      open={true}
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
