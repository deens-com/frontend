import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { primary } from 'libs/colors';
import { P } from 'libs/commonStyles';
import urls from 'libs/urlGenerator';

// i18n
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  margin: 0 !important;
  input {
    width: 100% !important;
  }
`;

const NotEditing = styled.div`
  display: inline-block;

  svg {
    margin: auto;
    color: ${primary};
  }
`;

function getCityText({ formattedAddress, city, countryCode }) {
  if (formattedAddress) {
    return formattedAddress;
  }
  if (!city) {
    return '';
  }
  return `${city}, ${countryCode}`;
}

export default ({ tripId, location, isFinal }) => {
  const place = getCityText(location || {});

  return (
    <Wrapper>
      <NotEditing>
        <P>
          {place || (
            <Trans>
              <Link to={urls.trip.settings(tripId)}>
                Please select {isFinal ? <Trans>a final</Trans> : <Trans>an initial</Trans>}{' '}
                location
              </Link>
            </Trans>
          )}
        </P>
      </NotEditing>
    </Wrapper>
  );
};
