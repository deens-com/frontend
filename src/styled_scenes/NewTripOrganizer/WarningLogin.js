import React from 'react';
import { warning } from 'libs/colors';
import { P } from 'libs/commonStyles';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// i18n
import { Trans } from '@lingui/macro';

const Wrapper = styled.div`
  background-color: ${warning};
  padding: 10px 0;
  text-align: center;
`;

export default () => {
  return (
    <Wrapper>
      <P>
        <Trans>
          We recommend that you{' '}
          <strong>
            <Link to="/register">signup</Link>
          </strong>{' '}
          or{' '}
          <strong>
            <Link to="/login">login</Link>
          </strong>{' '}
          to make sure you don't <strong>lose your trip</strong>
        </Trans>
      </P>
    </Wrapper>
  );
};
