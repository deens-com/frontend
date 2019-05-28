// NPM
import { disabled } from 'libs/colors';
import React, { Component } from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
// COMPONENTS
import SearchIcon from 'shared_components/icons/SearchIcon';

// ACTIONS/CONFIG

// STYLES
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  max-width: 540px;
  padding-right: ${props => (props.isMobile ? '0' : '25px')};
`;

const Inner = styled.div`
  background-color: #ffffff;
  border-radius: 10px 10px 10px 0;
  border: solid 1px ${props => (props.inFocus ? '#65AFBB' : '#eef1f4')};
  display: flex;
  flex: 1;
  height: 48px;
  padding: 8px 12px;
  transition: border 0.1s ease-in;
  width: 100%;
  overflow: hidden;
`;

const IconButton = styled.span`
  display: inline-block;
  margin-top: 3px;
  color: ${disabled};
  font-size: 24px;
  height: 26px;
  margin-right: 8px;
  width: 26px;

  &:last-child {
    margin-right: 15px;
  }
`;

const suggestionStyle = {
  width: '80vw',
  maxWidth: '500px',
};

// MODULE
export default class DesktopSearch extends Component {
  state = { inFocus: false };
  onFocus() {
    this.setState({ inFocus: true });
  }
  onBlur() {
    this.setState({ inFocus: false });
  }

  SearchInput() {
    return Loadable({
      loader: () => import('./SearchInput'),
      loading: (
        <input
          type="text"
          placeholder="Where would you like to go?"
          style={{ ...suggestionStyle, border: 'none', 'outline-width': 0 }}
        />
      ),
    });
  }

  render() {
    const { isMobile } = this.props;
    const SearchInput = this.SearchInput;
    return (
      <Wrapper isMobile={isMobile} inFocus={this.state.inFocus}>
        <Inner>
          <div>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <SearchInput {...this.props} />
        </Inner>
      </Wrapper>
    );
  }
}

// Props Validation
DesktopSearch.propTypes = {};
