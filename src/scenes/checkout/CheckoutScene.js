import React from 'react';
import { Grid } from 'semantic-ui-react';

import { Page, PageContent } from '../../shared_components/layout/Page';
import TopBar from '../../shared_components/TopBarWithSearch';
import CheckoutTripContainer from './CheckoutTripContainer';
import PaymentContainer from './PaymentContainer';

/**
 * Builds up the higher level blocks of the page
 */
const CheckoutScene = props => {
  return (
    <Page topPush>
      <TopBar fixed withPadding />
      <PageContent padding="32px">
        <Grid>
          <Grid.Column width={8}>
            <CheckoutTripContainer />
          </Grid.Column>
          <Grid.Column width={8}>
            <PaymentContainer />
          </Grid.Column>
        </Grid>
      </PageContent>
    </Page>
  );
};

CheckoutScene.propTypes = {};

export default CheckoutScene;
