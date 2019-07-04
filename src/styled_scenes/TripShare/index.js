import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
import { Loader, Dimmer } from 'semantic-ui-react';
import styled from 'styled-components';
import urls from 'libs/urlGenerator';
import { H2 } from 'libs/commonStyles';
import Options from './OptionSelector';
import ShareData from './ShareData';
import Public from './Public';
import BrandFooter from 'shared_components/BrandFooter';
import { PRIVACY_FRIENDS, PRIVACY_PUBLIC } from 'libs/trips';
import BackArrow from 'shared_components/icons/BackArrow';

const PageContent = styled.div`
  max-width: 1050px;
  margin: 0 20px 20px;
  ${media.minSmall} {
    margin: 0 auto 30px;
    width: 100%;
  }
`;

const BackButton = styled(Link)`
  position: relative;
  font-size: 14px;
  top: -10px;
  color: #097da8;
  display: flex;
  ${media.minSmall} {
    top: 30px;
  }
`;

const Title = styled(H2)`
  font-weight: bold;
  text-align: center;
`;

const Content = styled.div``;

export default ({ tripId, trip, patchTrip, isPatchingTrip }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [optionSelected, setOption] = useState(trip && trip.privacy);

  const changePrivacy = privacy => {
    patchTrip(tripId, {
      privacy,
    });
  };

  useEffect(
    () => {
      if (trip && !optionSelected) {
        setOption(trip.privacy);
      }
    },
    [trip],
  );

  const onSelectOption = option => {
    if (option !== PRIVACY_PUBLIC) {
      changePrivacy(option);
    }
    setOption(option);
  };

  const publishTrip = () => {
    patchTrip(tripId, {
      privacy: 'public',
    });
  };

  return (
    <>
      <PageContent>
        <Dimmer active={isSaving} page>
          <Loader size="massive" />
        </Dimmer>
        <BackButton to={urls.trip.organize(tripId)}>
          <BackArrow style={{ width: '1.5em', height: '1.5em', marginRight: '5px' }} />
          Back to trip
        </BackButton>
        <Content>
          <Title>How would you like to share your trip?</Title>
          <Options trip={trip} onSelect={onSelectOption} optionSelected={optionSelected} />
          {optionSelected === PRIVACY_FRIENDS && (
            <ShareData title="Here is a short link to your trip" trip={trip} />
          )}
          {trip &&
            optionSelected === PRIVACY_PUBLIC && (
              <Public
                isPatchingTrip={isPatchingTrip}
                patchTrip={patchTrip}
                publishTrip={publishTrip}
                trip={trip}
              />
            )}
        </Content>
      </PageContent>
      <BrandFooter />
    </>
  );
};
