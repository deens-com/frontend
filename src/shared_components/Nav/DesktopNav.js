// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Media from 'react-media';
import { connect } from 'react-redux';

// COMPONENTS
import DesktopDropDownMenu from './DesktopDropDownMenu';
// import CurrencySelector from '../Currency/Selector';
import I18nText from 'shared_components/I18nText';
import { Trans } from '@lingui/macro';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import * as colors from 'libs/colors';
import { PStrong } from 'libs/commonStyles';
import urls from 'libs/urlGenerator';

// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;

  ${props =>
    props.transparent &&
    css`
      flex: 1;
      justify-content: flex-end;
      & .Select--single > .Select-control .Select-value {
        color: white;
      }
    `};
`;

const Nav = styled.nav`
  color: inherit;
  display: flex;
  align-items: center;
  ${props =>
    props.transparent &&
    css`
      color: white;
      > a {
        color: white;
      }
    `};
`;

const navItemStyle = `
  display: inline-block;
  padding: 5px;
  position: relative;
  transition: color 0.1s ease-in;
  font-size: 15px;

  &:last-child {
    margin-right: 0;
  }

  &:after {
    background: #65AFBB;
    bottom: 0;
    content: '';
    display: block;
    height: 2px;
    left: 50%;
    opacity: 0;
    position: absolute;
    transform: translateX(-50%);
    transition: opacity 0.1s ease-in;
    width: 100%;
  }

  &.is-active,
  &:hover {
    color: ${colors.primaryHover};

    &:after {
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }
  }
`;

const Divider = styled.span`
  font-size: 18px;
  color: ${colors.disabled};
`;

const NavLink = styled(Link)`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  ${navItemStyle} margin: 0 8px;
  ${navItemStyle} p {
    color: ${colors.primary};
  }
`;

const ActionsWrap = styled.div`
  flex-shrink: 0;
  align-items: center;
  display: flex;
  padding-left: 15px;

  .Select-multi-value-wrapper {
    min-width: 37px;
  }

  > div:first-child {
    margin-right: 15px;
  }

  > div:nth-child(3) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

// MODULE
const TopBarDesktopNav = function TopBarDesktopNav({
  transparent,
  language,
  currency,
  theme,
  history,
  analytics,
  session,
  logOut,
  latestTrip,
}) {
  return (
    <Media
      query={`(min-width: ${sizes.large})`}
      render={() => (
        <Wrap transparent={transparent}>
          <Nav transparent={transparent}>
            {latestTrip && (
              <>
                <NavLink activeclassname="is-active" to={urls.trip.organize(latestTrip._id)}>
                  <PStrong>
                    <I18nText data={latestTrip.title} />
                  </PStrong>
                </NavLink>
                <Divider isBackgroundWhite={!transparent}>•</Divider>
              </>
            )}
            <NavLink activeclassname="is-active" to="/earn-money">
              <PStrong style={{ color: colors.secondary }}>
                <Trans>Earn Money</Trans>
              </PStrong>
            </NavLink>
            {!session.username && (
              <>
                <Divider isBackgroundWhite={!transparent}>•</Divider>
                <NavLink
                  data-testid="createTripHeaderButton"
                  activeclassname="is-active"
                  to={{
                    pathname: '/new/trip',
                    state: {
                      modal: true,
                    },
                  }}
                >
                  <PStrong>
                    <Trans>Create Trip</Trans>
                  </PStrong>
                </NavLink>
              </>
            )}
          </Nav>
          <ActionsWrap>
            <DesktopDropDownMenu
              session={session}
              logout={logOut}
              isBackgroundWhite={!transparent}
              history={history}
            />
          </ActionsWrap>
        </Wrap>
      )}
    />
  );
};

// Props Validation
TopBarDesktopNav.propTypes = {
  transparent: PropTypes.bool.isRequired,
  language: PropTypes.string,
  theme: PropTypes.string,
  currency: PropTypes.string,
};

TopBarDesktopNav.defaultProps = {
  language: 'english',
  currency: 'USD',
};

const mapDispatchToProps = dispatch => {
  return {
    analytics: analyticsPayload =>
      dispatch({ type: 'analytics', meta: { analytics: analyticsPayload } }),
  };
};
export default connect(
  null,
  mapDispatchToProps,
)(TopBarDesktopNav);
