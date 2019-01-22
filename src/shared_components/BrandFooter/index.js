// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import { Logo } from '../icons';
import { Instagram, Twitter, Facebook } from './icons';

// ACTIONS/CONFIG
import { media } from '../../libs/styled';

// STYLES
const Wrapper = styled.footer`
  padding: ${props => (props.withPadding ? '20px' : '10px 0 15px 0')};
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${props => (props.withTopBorder ? '#efeff0' : 'transparent')};
  height: 65px;

  ${props =>
    props.posRelative
      ? `
    position: relative;
    margin-top: -65px;
  `
      : ''} ${media.minSmall} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Company = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  ${media.minSmall} {
    margin-bottom: 0;
  }

  svg {
    display: block;
    width: auto;
    height: 50px;
    margin-right: 15px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #61676d;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;

  & > div:first-child {
    margin-right: 25px;
  }
`;

const ALink = styled.a`
  font-size: 14px;
  display: inline-block;
  padding: 5px 15px;
`;

// MODULE
export default function Footer({ posRelative, withTopBorder, withPadding }) {
  return (
    <Wrapper posRelative={posRelative} withTopBorder={withTopBorder} withPadding={withPadding}>
      <Nav>
        <div>
          <ALink
            target="_blank"
            rel="noopener noreferrer"
            href="https://vision.please.com/assets/terms.pdf"
          >
            Terms
          </ALink>
          <ALink
            target="_blank"
            rel="noopener noreferrer"
            href="https://vision.please.com/assets/privacy.pdf"
          >
            Privacy
          </ALink>
          <ALink target="_blank" rel="noopener noreferrer" href="https://help.please.com/">
            Help
          </ALink>
        </div>
      </Nav>
      <Company>
        <Logo style={{ width: '120px', marginRight: '10px' }} />
        <span>© Please.com</span>
      </Company>
      <div>
        <ALink
          href="https://www.facebook.com/PleaseTrips/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Facebook
            style={{
              height: '16px',
              width: '16px',
              display: 'block',
              fill: 'rgb(118, 118, 118)',
            }}
          />
        </ALink>
        <ALink href="https://twitter.com/PleaseTrips/" rel="noopener noreferrer" target="_blank">
          <Twitter
            style={{
              height: '16px',
              width: '16px',
              display: 'block',
              fill: 'rgb(118, 118, 118)',
            }}
          />
        </ALink>
        <ALink
          href="https://www.instagram.com/PleaseTrips/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Instagram
            style={{
              height: '16px',
              width: '16px',
              display: 'block',
              fill: 'rgb(118, 118, 118)',
            }}
          />
        </ALink>
      </div>
    </Wrapper>
  );
}

// Props Validation
Footer.propTypes = {};
