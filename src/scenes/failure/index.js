import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from 'shared_components/Button';
import CrossIcon from 'shared_components/icons/CrossIcon';
import tripDesignerActions from 'store/trip-designer/actions';
import urls from 'libs/urlGenerator';
import { error, backgroundError } from 'libs/colors';
import BrandFooter from 'shared_components/BrandFooter';

import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  flex: 1;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 50px;
`;

const Title = styled.div`
  font-size: 24px;
  color: ${error};
  font-weight: bold;
  margin-top: 25px;
`;

const FirstLine = styled.div`
  font-size: 16px;
  color: ${backgroundError};
  margin-top: 15px;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  margin: auto;
  width: 85px;
  height: 85px;
  background-color: ${error};
  color: white;
  border-radius: 50px;
  padding-top: 1px;
  > svg {
    width: 72px;
    height: 72px;
    margin: auto;
    margin-top: 10px;
    > path: {
      fill: white;
    }
  }
`;

const Failure = ({ match, trip }) => {
  const tripId = match.params.id;
  return (
    <React.Fragment>
      <Wrapper>
        <IconWrapper>
          <CrossIcon style={{ width: 72, height: 72 }} />
        </IconWrapper>
        <Title>
          <Trans>There was an error while trying to book the trip</Trans>
        </Title>
        <FirstLine>
          <Trans>Please try again</Trans>
        </FirstLine>
        <Button type="link" href={urls.trip.checkout(tripId)} theme="textLightGreen">
          <Trans>Go to checkout page again</Trans>
        </Button>
      </Wrapper>
      <BrandFooter />
    </React.Fragment>
  );
};

Failure.propTypes = {};

const mapStateToProps = (state, props) => {
  return {
    trip: state.tripDesigner.trip.data,
  };
};

export default connect(mapStateToProps)(withRouter(Failure));
