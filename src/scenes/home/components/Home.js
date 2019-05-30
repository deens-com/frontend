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
    picture > img {
      max-width: 400px;
    }
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

const world = (
  <picture>
    <img
      sizes="(max-width: 821px) 100vw, 821px"
      srcSet="
      world_levbj2_c_scale,w_200.png 200w,
      world_levbj2_c_scale,w_821.png 821w"
      data-src="world_levbj2_c_scale,w_821.png"
      alt="Customizable holidays"
      className="lazyload"
    />
  </picture>
);

const Content = React.lazy(() => import('./Content'));

const HomeComponent = props => {
  const [hasToLoadContent, setHasToLoadContent] = useState(false);
  return (
    <>
      <PageTop>
        <div>
          <HomeTagLine>
            <Secondary>Customizable</Secondary> holidays created by locals for{' '}
            <Secondary>FREE</Secondary>
          </HomeTagLine>
          <HomeTagSubtitle>Where do you want to go?</HomeTagSubtitle>
          <HomeSearch
            savedAddress={props.savedAddress}
            updateSearchParams={props.updateSearchParams}
          />
        </div>
        <Media query={`(min-width: ${sizes.large})`}>
          {matches => matches && <div style={{ flexGrow: 1, textAlign: 'center' }}>{world}</div>}
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
                Travel Inspiration
              </div>
            )
          }
        </Media>
      </Suspense>
      <Media query={`(min-width: ${sizes.large})`}>
        {matches =>
          matches ? null : <div style={{ height: '30vw', overflow: 'hidden' }}>{world}</div>
        }
      </Media>
      <BrandFooter />
    </>
  );
};

export default HomeComponent;
