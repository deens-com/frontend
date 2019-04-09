import React from 'react';
import styled from 'styled-components';
import { getDayDate } from 'styled_scenes/Trip/mapServicesToDays';
import { H2, H2Subtitle, P } from 'libs/commonStyles';
import { secondary } from 'libs/colors';

const Divider = styled.span`
  color: ${secondary};
  margin: 0 5px;
`;

export default ({ day, tripStartDate }) => (
  <>
    <H2>Day {day}</H2>
    <Divider>•</Divider>
    <H2Subtitle>{getDayDate(day, tripStartDate)}</H2Subtitle>
  </>
);
