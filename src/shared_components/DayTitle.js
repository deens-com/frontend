import React from 'react';
import styled from 'styled-components';
import { getDayDate } from 'styled_scenes/Trip/mapServicesToDays';
import { H2, H2Subtitle, P } from 'libs/commonStyles';
import { secondary } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const Divider = styled.span`
  color: ${secondary};
  margin: 0 5px;
`;

export default ({ day, tripStartDate }) => (
  <>
    <H2>
      <Trans>Day</Trans> {day}
    </H2>
    {tripStartDate && (
      <>
        <Divider>•</Divider>
        <H2Subtitle>{getDayDate(day, tripStartDate)}</H2Subtitle>
      </>
    )}
  </>
);
