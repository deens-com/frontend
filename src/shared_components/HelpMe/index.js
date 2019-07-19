import React from 'react';
import history from 'main/history';
import Button from 'shared_components/Button';
import analytics from 'libs/analytics';

export default ({ tripId, tripParent, isLoadingUser, user, buttonSize }) => {
  return (
    <Button
      onClick={() => {
        analytics.planning.brief.start();
        history.push('/help', {
          modal: true,
          helpData: {
            tripParent,
            isLoadingUser,
            user,
            tripId,
          },
        });
      }}
      theme="fillLightGreen"
      size={buttonSize}
    >
      Help me!
    </Button>
  );
};
