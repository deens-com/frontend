// NPM
import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import { Link } from 'react-router-dom';

// ACTIONS/CONFIG
import * as colors from 'libs/colors';
import { H6, P, PSmall } from 'libs/commonStyles';
import { PageWrapper } from 'shared_components/layout/Page';
import { languages, availableLanguages, getUserLanguage } from 'libs/language';
import { setLang } from 'libs/cookies';
import { Dropdown } from 'semantic-ui-react';
import { media } from 'libs/styled';

const Wrapper = styled.div`
  background-color: ${colors.backgroundDark};
  padding-top: 35px;
  padding-bottom: 10px;
  margin-bottom: ${props => props.marginBottom}px;
`;

const ColumnWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  ${media.minSmall} {
    flex-direction: row;
  }
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

  margin-bottom: 25px;
  margin-left: 25px;
  ${media.minSmall} {
    margin-bottom: 0;
    margin-left: 0;
  }
`;

const LinkElement = styled(P)`
  > * {
    color: ${colors.primary};
  }
`;

const Copyright = styled(PSmall)`
  text-align: center;
  margin-top: 25px;
`;

const OptionSelector = styled.select`
  border-radius: 5px 5px 5px 0;
  color: white;
  background-color: ${colors.primary};
  margin-left: 10px;
  padding: 5px;
  outline: none;
`;

export default ({ marginBottom = 0 }) => (
  <Wrapper marginBottom={marginBottom}>
    <PageWrapper>
      <ColumnWrapper>
        <Column>
          <H6>Preferences</H6>
          <LinkElement>
            <span>Language</span>
            <OptionSelector
              defaultValue={getUserLanguage()}
              onChange={e => {
                if (e.target && e.target.value) {
                  setLang(e.target.value);
                  window.location.reload(true);
                }
              }}
            >
              {availableLanguages.map(lang => {
                return <option value={lang}>{languages[lang]}</option>;
              })}
            </OptionSelector>
          </LinkElement>
        </Column>
        <Column>
          <H6>Network</H6>
          <LinkElement>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://deens.com/${getUserLanguage()}/blog/`}
            >
              Our Blog
            </a>
          </LinkElement>
          <LinkElement>
            <Link to="/about/partners">Partners</Link>
          </LinkElement>
          <LinkElement>
            <Link to="/about/press">Press</Link>
          </LinkElement>
        </Column>
        <Column>
          <H6>Legal</H6>
          <LinkElement>
            <Link rel="nofollow" to="/legal/cookies">
              Use of Cookies
            </Link>
          </LinkElement>
          <LinkElement>
            <Link rel="nofollow" to="/legal/terms">
              Terms & Conditions
            </Link>
          </LinkElement>
          <LinkElement>
            <Link rel="nofollow" to="/legal/privacy">
              Privacy Policy
            </Link>
          </LinkElement>
        </Column>
        <Column>
          <H6>Contact</H6>
          <LinkElement>
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
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
