// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Media from 'react-media';

// COMPONENTS
import { Arrow, Microphone, Search } from '../../icons';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

// STYLES
const Wrapper = styled.div`
  padding-right: 25px;
  display: flex;
  align-items: center;
  max-width: 650px;
  flex: 1;
`;

const Inner = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px 12px;
  height: 48px;
  display: flex;
  flex: 1;
  width: 100%;
  border: solid 1px ${props => (props.inFocus ? '#4fb798' : '#eef1f4')};
  transition: border 0.1s ease-in;
`;

const Icons = styled.div``;

const Button = styled.button`
  display: inline-block;
  background: none;
  border: none;
  outline: none;
  font-size: inherit;
  font-style: inherit;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  color: #4fb798;

  ${props =>
    props.align &&
    css`
      display: flex;
      align-items: center;
    `};
`;

const IconButton = Button.extend`
  width: 26px;
  height: 26px;
  margin-right: 8px;

  &:last-child {
    margin-right: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  display: inline-block;
  background: none;
  border: none;
  outline: none;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  font-family: inherit;
  width: 100%;
  flex: 1;
  margin-right: 15px;
`;

const ArrowIcon = styled.span`
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-left: 7px;
  margin-right: 3px;
`;

// MODULE
export default class DesktopSearch extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      mode: 'text',
      inFocus: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onFocus() {
    this.setState({ inFocus: true });
  }
  onBlur() {
    this.setState({ inFocus: false });
  }
  handleInputChange(ev) {
    this.setState({ search: ev.target.value });
  }
  handleSubmit(ev) {
    ev.preventDefault();
    alert(this.state.search);
    this.setState({ search: '' });
  }
  render() {
    return (
      <Wrapper inFocus={this.state.inFocus}>
        <Inner>
          <Icons>
            <IconButton>
              <Microphone
                style={this.state.mode === 'voice' ? { fill: '#50a18a' } : { fill: '#d3d7dc' }}
              />
            </IconButton>
            <IconButton>
              <Search
                style={this.state.mode === 'text' ? { fill: '#50a18a' } : { fill: '#d3d7dc' }}
              />
            </IconButton>
          </Icons>
          <Form onSubmit={this.handleSubmit}>
            <Input
              ref={el => {
                this.input = el;
              }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.state.search}
              onChange={this.handleInputChange}
              type="text"
              placeholder="Tell us about your dream stay"
            />
            <Button align type="submit">
              Let's go
              <ArrowIcon>
                <Arrow style={{ fill: '#50a18a' }} />
              </ArrowIcon>
            </Button>
          </Form>
        </Inner>
      </Wrapper>
    );
  }
}

// Props Validation
DesktopSearch.propTypes = {};
