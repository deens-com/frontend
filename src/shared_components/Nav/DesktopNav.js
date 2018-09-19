// NPM
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Media from 'react-media';
import { connect } from 'react-redux';

// COMPONENTS
import DesktopDropDownMenu from './DesktopDropDownMenu';
import CurrencySelector from '../Currency/Selector';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import { mainNav } from '../../data/nav';
import { trackHeaderCategoryClick } from 'libs/analytics';

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
  ${props =>
    props.home &&
    css`
      a {
        color: white;
      }
    `};
`;

const NavLink = styled(Link)`
  display: inline-block;
  margin-right: 15px;
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

// MODULE
const TopBarDesktopNav = function TopBarDesktopNav({
  home,
  language,
  currency,
  theme,
  history,
  analytics,
}) {
  return (
    <Media
      query={`(min-width: ${sizes.large})`}
      render={() => (
        <Wrap home={home}>
          <Nav home={home}>
            {mainNav.map(item => (
              <NavLink
                key={item.label}
                activeclassname="is-active"
                to={item.href}
                onClick={() => analytics(trackHeaderCategoryClick(item.label))}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
          <ActionsWrap>
            <DesktopDropDownMenu isBackgroundWhite={home} theme={theme} history={history} />
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
