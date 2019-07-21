// NPM
import React, { useState, Suspense } from 'react';
import styled from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import HomeSearch from 'styled_scenes/Home/components/HomeSearch';
import BrandFooter from 'shared_components/BrandFooter';

// ACTIONS/CONFIG
import { sizes, media } from 'libs/styled';
import { H2Subtitle } from 'libs/commonStyles';

// i18n
import I18nText from 'shared_components/I18nText';
import { Trans } from '@lingui/macro';

// STYLES
import { textDark, secondary, primary } from 'libs/colors';
import LoadingDots from 'shared_components/LoadingDots';

const PageTop = styled.div`
  width: 100%;
  position: relative;
  padding: 0 15px 45px 15px;
  margin: auto;
  max-width: 1350px;
  display: flex;
  flex-direction: column;
  margin-top: 75px;
  max-width: 1350px;
  ${media.minLarge} {
    flex-direction: row;
  }
`;

const WorldWrapper = styled.div`
  flex-grow: 1;
  text-align: center;
  > img {
    max-width: 400px;
  }
`;

const HomeTagLine = styled.h1`
  color: ${textDark};
  font-size: 34px;
  font-weight: 900;
  margin-top: 0px;
  margin-left: 13px;
  padding-bottom: 20px;
  position: relative;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  max-width: 590px;
  margin: auto;
  padding-top: 50px;

  ${media.minSmall} {
    font-size: 34px;
  }

  ${media.minMedium} {
    font-size: 34px;
  }
  ${media.minLarge} {
    padding-top: 110px;
    text-align: left;
  }
`;

const Secondary = styled.span`
  color: ${secondary};
`;

const HomeTagSubtitle = styled(H2Subtitle)`
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
  ${media.minLarge} {
    text-align: left;
  }
`;

const MobileWorldWrapper = styled.div`
  height: 50vw;
  margin-top: 25px;
  overflow: hidden;
  > img {
    width: 100vw;
  }
`;

const world = <img data-src="/world.png" alt="Customizable holidays" className="lazyload" />;

const Content = React.lazy(() => import('./Content'));

const HomeComponent = props => {
  const [hasToLoadContent, setHasToLoadContent] = useState(false);
  return (
    <>
      <PageTop>
        <div>
          <HomeTagLine>
            <Trans>
              <Secondary>Customizable</Secondary> travels created by locals for{' '}
              <Secondary>free</Secondary>
            </Trans>
          </HomeTagLine>
          <HomeTagSubtitle>
            <Trans>Where do you want to go?</Trans>
          </HomeTagSubtitle>
          <HomeSearch
            savedAddress={props.savedAddress}
            updateSearchParams={props.updateSearchParams}
          />
        </div>
        <Media query={`(min-width: ${sizes.large})`}>
          {matches => matches && <WorldWrapper>{world}</WorldWrapper>}
        </Media>
      </PageTop>
      <Suspense
        fallback={
          <span style={{ display: 'block', width: '100%', maxWidth: '50px', margin: 'auto' }}>
            <LoadingDots />
          </span>
        }
      >
        <Media query={`(min-width: ${sizes.large})`}>
          {matches =>
            matches ? (
              <Content {...props} />
            ) : hasToLoadContent ? (
              <Content {...props} />
            ) : (
              <div
                onClick={() => setHasToLoadContent(true)}
                style={{ textAlign: 'center', cursor: 'pointer', color: primary }}
              >
                <Trans>Travel Inspiration</Trans>
              </div>
            )
          }
        </Media>
      </Suspense>
      <Media query={`(min-width: ${sizes.large})`}>
        {matches => (matches ? null : <MobileWorldWrapper>{world}</MobileWorldWrapper>)}
      </Media>
      <BrandFooter />
    </>
  );
};

export default HomeComponent;
