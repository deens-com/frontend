import React from 'react';
import styled from 'styled-components';
import CartSpeed from 'shared_components/icons/CartSpeed';
import { PSmallStrong } from 'libs/commonStyles';
import * as colors from 'libs/colors';
import { Trans } from '@lingui/macro';

const BookableTag = styled(PSmallStrong)`
  background-color: ${colors.backgroundLight};
  border-radius: 3px;
  color: ${colors.textDark};
  padding: 2px 5px;
  display: inline-block;
  height: 22px;
  vertical-align: bottom;
  line-height: 16px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

export default () => (
  <BookableTag>
    <CartSpeed
      style={{
        color: colors.tertiary,
        display: 'inline-block',
        width: 12,
        height: 12,
        verticalAlign: 'middle',
      }}
    />
    <span style={{ verticalAlign: 'middle', marginLeft: '5px' }}>
      <Trans>fast booking</Trans>
    </span>
  </BookableTag>
);
