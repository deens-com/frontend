import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { Page, PageContent } from '../../shared_components/layout/Page';
import TopBar from '../../shared_components/TopBar';
import CheckoutTripContainer from './CheckoutTripContainer';
import PaymentContainer from './PaymentContainer';

/**
 * Builds up the higher level blocks of the page
 */
const CheckoutScene = props => {
  return (
    <Page topPush>
      <TopBar fixed />
      <PageContent padding="32px">
        <Grid stackable celled>
          <Grid.Column width={8}>
            <CheckoutTripContainer />
          </Grid.Column>
          <Grid.Column width={8}>
            {/* TODO: @jaydp make the API Key a variable to change according to the environment */}
            <StripeProvider apiKey="pk_test_YJMT2TRc342139N5bjZYr7EO">
              <Elements>
                <PaymentContainer />
              </Elements>
            </StripeProvider>
          </Grid.Column>
        </Grid>
      </PageContent>
    </Page>
  );
};

CheckoutScene.propTypes = {};

export default CheckoutScene;
