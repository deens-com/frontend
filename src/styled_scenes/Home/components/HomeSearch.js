// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import {
  SearchIcon,
  MicrophoneIcon,
  DateIcon
} from "../../../components/icons";
import FormControl from "../../../components/Form/FormControl";

// ACTIONS & CONFIG
import { placeholderMixin, resetButton } from "../../../libs/styled";

// STYLES
const Button = styled.button`
  ${resetButton()} color: #4fb798;
  outline: none;
  transition: color 0.1s ease-out;
  width: auto;

  &:hover,
  &:focus {
    color: #7bceb6;
  }
`;

const Span = styled.span`
  color: ${props => (props.muted ? "#99a9be" : "inherit")};
`;

const Input = styled.input`
  appearance: none;
  background: none;
  border-radius: 3px;
  border: 0;
  display: block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  outline: none;
  padding: 10px 0;
  width: 100%;

  ${placeholderMixin(`
    color: #99a9be;
  `)};
`;

const Wrapper = styled.div`
  position: relative;
  top: 35px;
`;

const TypeIcon = styled.div`
  align-items: center;
  background: ${props =>
    props.active ? "linear-gradient(50deg, #89c8a3, #4fb798)" : "transparent"};
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 40px;
  margin-right: 10px;
  overflow: hidden;
  width: 40px;

  svg {
    height: 26px;
    width: 26px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const TypeWrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  padding: 0 10px;
`;

const SearchBg = styled.div`
  position: relative;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  height: 72px;
  padding: 0 25px;
`;

const BGPin = styled.div`
  position: absolute;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3e%3cpath d='M7 4.7c0-.1-.1-.2-.1-.2L2.9.6v1.9l1.8 1.8.7.7-.7.7-1.8 1.8v1.9l3.9-3.9.2-.2c.1-.2.1-.4 0-.6z' fill='white'/%3e%3cpath d='M2.9 2.5v1.8h1.8zM2.9 5.7v1.8l1.8-1.8zM6.9 5.5c0-.1.1-.2.1-.2s-.1.1-.1.2zM6.9 4.5c0 .1.1.2.1.2s-.1-.1-.1-.2zM5.4 5l-.7-.7H2.9v1.4h1.8z' fill='white'/%3e%3c/svg%3e");
  width: 12px;
  height: 12px;
  top: -8px;
  left: 0px;
  transition: transform 0.2s;
`;

const TabIcon = styled.span`
  display: block;
  height: 100%;
  width: 100%;
`;

const DateWrap = styled.div`
  display: flex;
  width: 100%;

  & > div {
    border: none;
    flex: 1;
    position: relative;

    &:first-child {
      &:after {
        color: red;
        content: "";
        display: block;
        height: 100%;
        position: absolute;
        right: 10px;
        top: 0;
        width: 1px;
      }
    }
  }
`;

// MODULE
const searchTypes = [
  { type: "voice", label: "V" },
  { type: "text", label: "S" },
  { type: "date", label: "D" }
];

export default class HomeSearch extends Component {
  constructor() {
    super();
    this.state = {
      type: "voice",
      search: ""
    };

    this.setType = this.setType.bind(this);
    this.setSearch = this.setSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.state.type === "text") {
      this.input.focus();
    }
  }

  setType(type) {
    this.setState({ type });
  }

  setSearch(ev) {
    this.setState({ search: ev.target.value });
  }

  handleSearchSubmit(ev) {
    ev.preventDefault();
    alert("Searching for" + this.state.search);
    this.setState({ search: "" });
  }

  render() {
    return (
      <Wrapper>
        <TypeWrapper>
          {searchTypes.map(opt => (
            <TypeIcon
              key={opt.type}
              active={opt.type === this.state.type}
              onClick={ev => {
                this.setType(opt.type);
              }}
            >
              {opt.type === "voice" && <MicrophoneIcon />}
              {opt.type === "text" && <SearchIcon />}
              {opt.type === "date" && <DateIcon />}
            </TypeIcon>
          ))}
        </TypeWrapper>
        <SearchBg>
          <BGPin
            style={{
              transform: `rotate(-90deg) translateY(${
                this.state.type === "voice"
                  ? "24"
                  : this.state.type === "text" ? "72" : "122"
              }px)`
            }}
          />
          {this.state.type === "voice" && (
            <div>
              <Button
                onClick={() => {
                  alert("Initiating serach");
                }}
              >
                Click here
              </Button>
              <Span muted>
                {" "}
                to user your voice and tell us about your dream stay
              </Span>
            </div>
          )}
          {this.state.type === "text" && (
            <form style={{ width: "100%" }} onSubmit={this.handleSearchSubmit}>
              <Input
                type="text"
                name="search"
                innerRef={input => {
                  this.input = input;
                }}
                value={this.state.search}
                onChange={this.setSearch}
                placeholder="Stary typing.."
              />
            </form>
          )}
          {this.state.type === "date" && (
            <DateWrap>
              <FormControl
                type="date"
                onChange={value => {
                  console.log(value);
                }}
                value=""
                placeholder="Start date"
                leftIcon="date"
              />
              <FormControl
                type="date"
                onChange={value => {
                  console.log(value);
                }}
                value=""
                placeholder="End date"
                leftIcon="date"
              />
            </DateWrap>
          )}
        </SearchBg>
      </Wrapper>
    );
  }
}

// Props Validation
HomeSearch.propTypes = {};
