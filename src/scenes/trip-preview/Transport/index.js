import React from 'react';
import styled from 'styled-components';
import { getKmFromMeters } from 'libs/Utils';
import { P, H4 } from 'libs/commonStyles';
import { secondsToHoursAndMinutes } from 'libs/trips';
import { getIconAndTextFromTransport, renderTime } from 'libs/transports';
import { Trans } from '@lingui/macro';
import { backgroundDark, backgroundLight, primary } from 'libs/colors';

const MainData = styled.div`
  display: flex;
  align-items: center;
`;

const StepsWrapper = styled.div`
  background: ${props => (props.evenDay ? backgroundLight : backgroundDark)};
  margin-left: 40px;
  padding: 20px;
  margin-top: 20px;
`;

const TransportIcon = styled.img`
  margin: 5px 0;
`;

const TransportSteps = styled.ul`
  padding: 15px;
  padding-bottom: 5px;
  list-style: none;
  counter-reset: li;
  > li {
    margin-bottom: 5px;
    counter-increment: li;
    &::before {
      content: counter(li);
      color: ${primary};
      display: inline-block;
      width: 1.5em;
      margin-left: -2em;
      margin-right: 0.5em;
      text-align: right;
      direction: rtl;
    }
  }
`;

export default ({ data, evenDay }) => {
  const { text: transportText, icon: transportIcon } = getIconAndTextFromTransport(data);
  const time = secondsToHoursAndMinutes(data && data.route && data.route.baseTimeInSeconds);
  const distance = getKmFromMeters(data && data.route && data.route.distanceInMeters);
  if (data && data.route && data.route.steps) {
    return (
      <StepsWrapper evenDay={evenDay}>
        <MainData>
          <TransportIcon src={transportIcon} />
          <H4 style={{ marginLeft: 10 }}>{transportText}</H4>
          <P style={{ marginLeft: 10 }}>
            {renderTime(time)} ({distance}
            <Trans>km</Trans>)
          </P>
        </MainData>
        <TransportSteps>
          {data.route.steps.map(step => (
            <li key={step.key}>{step.text}</li>
          ))}
        </TransportSteps>
      </StepsWrapper>
    );
  }
  return (
    <MainData style={{ marginLeft: 40, marginTop: 10 }}>
      <TransportIcon src={transportIcon} />
      <H4 style={{ marginLeft: 10 }}>{transportText}</H4>
      <P style={{ marginLeft: 10 }}>
        {renderTime(time)} ({distance}
        <Trans>km</Trans>)
      </P>
    </MainData>
  );
};
