// NPM
import React from 'react';
import styled from 'styled-components';

import I18nText from 'shared_components/I18nText';

const Category = styled.div`
  flex: 1;
  display: flex;
  font-size: ${props => props.fontSize};
  line-height: ${props => props.lineHeight};
  color: #6e7885;
  letter-spacing: 1.2px;
  justify-content: flex-start;
  text-transform: uppercase;
  font-weight: bold;
  align-items: center;
  svg {
    font-size: ${props => props.iconSize};
    margin-right: 5px;
    path {
      fill: ${props => props.color};
    }
  }
`;

export default ({ color, icon, name, fontSize, iconSize, lineHeight }) => (
  <Category color={color} fontSize={fontSize} lineHeight={lineHeight} iconSize={iconSize}>
    {icon}
    <I18nText data={name} />
  </Category>
);
