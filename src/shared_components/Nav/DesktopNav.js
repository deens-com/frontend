// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import Media from 'react-media';
import { connect } from 'react-redux';

// COMPONENTS
import DesktopDropDownMenu from './DesktopDropDownMenu';
// import CurrencySelector from '../Currency/Selector';
import I18nText from 'shared_components/I18nText';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import { lightText, primary, secondary } from 'libs/colors';
import { PStrong } from 'libs/commonStyles';
import { icoReady } from 'libs/config';

// STYLES
const Wrap = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;

  ${props =>
    props.home &&
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
  ${props =>
    props.home &&
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
    background: #4fb798;
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
    color: #4fb798;

    &:after {
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }
  }
`;

const Divider = styled.span`
  font-size: 18px;
  color: ${props => (props.isBackgroundWhite ? secondary : lightText)};
`;

const NavLink = styled(Link)`
  ${navItemStyle} margin: 0 8px;
  ${navItemStyle} p {
    color: ${primary};
  }
`;

const NavDropdown = styled.span`
  ${navItemStyle};
`;

const ActionsWrap = styled.div`
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

const DropdownTrigger = () => <NavDropdown activeclassname="is-active">Token Sale</NavDropdown>;

// MODULE
const TopBarDesktopNav = function TopBarDesktopNav({
  home,
  language,
  currency,
  theme,
  history,
  analytics,
  session,
  logOut,
  tripInProgress,
  latestTrip,
}) {
  return (
    <Media
      query={`(min-width: ${sizes.large})`}
      render={() => (
        <Wrap home={home}>
          <Nav home={home}>
            {icoReady && (
              <Dropdown
                trigger={DropdownTrigger()}
                direction="left"
                style={{ color: 'inherit', marginRight: 30 }}
              >
                <Dropdown.Menu>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item"
                    href="https://protocol.please.com"
                  >
                    <span className="text">Information</span>
                  </a>
                  <Dropdown.Item text="Contribute" as={Link} to="/token-sale" />
                </Dropdown.Menu>
              </Dropdown>
            )}
            {session.username &&
              tripInProgress && (
                <>
                  <Divider isBackgroundWhite={!home}>•</Divider>
                  <NavLink activeclassname="is-active" to="/trips/organize/...">
                    <PStrong>This is a trip name</PStrong>
                  </NavLink>
                </>
              )}
            {latestTrip && (
              <>
                <NavLink activeclassname="is-active" to={`/trips/organize/${latestTrip._id}`}>
                  <PStrong>
                    <I18nText data={latestTrip.title} />
                  </PStrong>
                </NavLink>
                <Divider isBackgroundWhite={!home}>•</Divider>
              </>
            )}
            <NavLink activeclassname="is-active" to="/earn-money">
              <PStrong>Earn Money</PStrong>
            </NavLink>
            {!session.username && (
              <>
                <Divider isBackgroundWhite={!home}>•</Divider>
                <NavLink activeclassname="is-active" to="/trips/create">
                  <PStrong>Create Trip</PStrong>
                </NavLink>
              </>
            )}
          </Nav>
          <ActionsWrap>
            <DesktopDropDownMenu
              session={session}
              logOut={logOut}
              isBackgroundWhite={!home}
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
  home: PropTypes.bool.isRequired,
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
