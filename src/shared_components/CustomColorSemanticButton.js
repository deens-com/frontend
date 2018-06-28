import React from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

const CustomButton = styled(Button)`
  background-color: ${({ bgColor }) => bgColor} !important;
  color: ${({ whiteText }) => (whiteText ? '#FFF' : 'rgba(0,0,0,.6)')} !important;
`;

const CustomColorSemanticButton = props => {
  return <CustomButton {...props} />;
};

export default CustomColorSemanticButton;
