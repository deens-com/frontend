// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import { Link } from 'react-router-dom';
import { Logo } from '../icons';
import { Instagram, Twitter, Facebook } from './icons';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';
import * as colors from 'libs/colors';
import { H6, P, PSmall } from 'libs/commonStyles';
import { PageWrapper } from 'shared_components/layout/Page';

const Wrapper = styled.div`
  background-color: ${colors.backgroundDark};
  padding-top: 35px;
  padding-bottom: 10px;
  margin-bottom: ${props => props.marginBottom}px;
`;

const ColumnWrapper = styled.footer`
  display: flex;
`;

const Column = styled.div`
  flex: 1;
  > h6 {
    color: ${colors.secondary};
    margin-bottom: 14px;
  }

  > p {
    margin-bottom: 8px;
  }

  > p:last-child {
    margin-bottom: 0;
  }
`;

const LinkElement = styled(P)`
  > a {
    color: ${colors.primary};
  }
`;

const Copyright = styled(PSmall)`
  text-align: center;
  margin-top: 25px;
`;

export default ({ marginBottom = 0 }) => (
  <Wrapper marginBottom={marginBottom}>
    <PageWrapper>
      <ColumnWrapper>
        <Column>
          <H6>Network</H6>
          <LinkElement>
            <a target="_blank" rel="noopener noreferrer" href="https://blog.deens.com/">
              Our Blog
            </a>
          </LinkElement>
          <LinkElement>
            <Link to="/partners">Partners</Link>
          </LinkElement>
          <LinkElement>
            <Link to="/affiliates">Affiliates</Link>
          </LinkElement>
          <LinkElement>
            <Link to="/press">Press</Link>
          </LinkElement>
        </Column>
        <Column>
          <H6>Legal</H6>
          <LinkElement>
            <a rel="nofollow" href="/cookie-policy">
              Use of Cookies
            </a>
          </LinkElement>
          <LinkElement>
            <a rel="nofollow" href="/terms-conditions">
              Terms & Conditions
            </a>
          </LinkElement>
          <LinkElement>
            <a rel="nofollow" href="/privacy-policy">
              Privacy Policy
            </a>
          </LinkElement>
        </Column>
        <Column>
          <H6>Contact</H6>
          <LinkElement>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pleaseassist.freshdesk.com/support/home"
            >
              Help Center
            </a>
          </LinkElement>
        </Column>
      </ColumnWrapper>
      <Copyright>© 2019 Deens.com. All rights reserved.</Copyright>
    </PageWrapper>
  </Wrapper>
);
