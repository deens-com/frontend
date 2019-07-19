import React, { useEffect } from 'react';
import queryString from 'query-string';
import styled from 'styled-components';
import Button from 'shared_components/Button';
import CheckIcon from 'shared_components/icons/CheckIcon';
import { PageContent } from 'shared_components/layout/Page';
import BrandFooter from 'shared_components/BrandFooter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

// i18n
import { I18n } from '@lingui/react';
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  flex: 1;
  order: -1;
  text-align: center;
  padding-top: 75px;
`;

const Title = styled.div`
  font-size: 24px;
  color: #097da8;
  font-weight: bold;
  margin-top: 25px;
`;

const FirstLine = styled.div`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 40px;
`;

const IconWrapper = styled.div`
  margin: auto;
  width: 85px;
  height: 85px;
  background-color: #097da8;
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

const TripCreator = props => {
  const params = queryString.parse(props.location.search);
  useEffect(() => {
    props.changeHeader();
  });
  return (
    <>
      <PageContent padding="24px">
        <Wrapper>
          {params.success === 'true' ? (
            <React.Fragment>
              <IconWrapper>
                <CheckIcon style={{ width: 72, height: 72 }} />
              </IconWrapper>
              <Title>Thank you!</Title>
              <FirstLine>
                <Trans>Your account has been verified.</Trans>
              </FirstLine>
              <Button type="link" href="/login" theme="textLightGreen">
                <Trans>Login to continue</Trans>
              </Button>
            </React.Fragment>
          ) : params.message ? (
            <>
              <Title>{params.message}</Title>
            </>
          ) : (
            <>
              <Title>Expired link</Title>
              <FirstLine>
                <Trans>Your link has expired.</Trans>
              </FirstLine>
            </>
          )}
        </Wrapper>
      </PageContent>
      <BrandFooter withTopBorder withPadding />
    </>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(TripCreator);
