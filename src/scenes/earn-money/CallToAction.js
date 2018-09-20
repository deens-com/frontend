import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from '../../shared_components/Button';

const Container = styled.div`
  margin-top: 32px;
  a {
    font-size: 14px;
  }
`;

const SignUpContainer = styled.div`
  color: #3c434b;
  font-size: 14px;
  margin-top: 18px;
`;
const SignUp = styled(Link)`
  font-weight: bold;
`;

const LoggedOut = ({ text }) => (
  <Container>
    <Button bold type="link" theme="fillLightGreen" round size="small" href="/login">
      {text}
    </Button>
    <SignUpContainer>
      Don't have an account yet? <SignUp to="/register">Sign up</SignUp>
    </SignUpContainer>
  </Container>
);

const LoggedIn = ({ text, url }) => (
  <Container>
    <Button bold type="link" theme="fillLightGreen" round size="small" href={url}>
      {text}
    </Button>
  </Container>
);

const CallToAction = ({ loggedIn, text, url, loggedOutText }) =>
  loggedIn ? LoggedIn({ text, url }) : LoggedOut({ text: loggedOutText });

export default CallToAction;
