import React from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

const CustomButton = styled(Button)`
  background-color: ${({ style }) => style.bgColor} !important;
  color: ${({ style }) => (style.whiteText ? '#FFF' : 'rgba(0,0,0,.6)')} !important;
`;

const CustomColorSemanticButton = props => {
  const { bgColor, whiteText, ...restProps } = props;
  return <CustomButton {...restProps} style={{ bgColor, whiteText }} />;
};

export default CustomColorSemanticButton;
