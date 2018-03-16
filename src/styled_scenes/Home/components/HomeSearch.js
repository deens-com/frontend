// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import FormControl from "../../../shared_components/FormControl";
import { Search, Microphone, DateIcon } from "../../../shared_components/icons";
import FlatControl from "../../../shared_components/Form/FlatControl";

// ACTIONS & CONFIG
import { placeholderMixin } from "../../../libs/styled";

// STYLES
const Button = styled.button`
  font-size: inherit;
  font-style: inherit;
  font-family: inherit;
  color: inherit;
  background: inherit;
  border: inherit;
  cursor: pointer;
  outline: none;

  color: #4fb798;
  transition: color 0.1s ease-out;

  &:hover,
  &:focus {
    color: #7bceb6;
  }
`;

const Span = styled.span`
  color: ${props => (props.muted ? "#99a9be" : "inherit")};
`;

const Input = styled.input`
  display: block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  border-radius: 3px;
  background: none;
  width: 100%;
  border: 0;
  outline: none;
  appearance: none;
  padding: 10px 0;

  ${placeholderMixin(`
    color: #99a9be;
  `)};
`;

const Wrapper = styled.div`
  position: relative;
  top: 35px;
`;

const TypeIcon = styled.div`
  background: ${props =>
    props.active ? "linear-gradient(50deg, #89c8a3, #4fb798)" : "transparent"};
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 10px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 40px;

  svg {
    width: 26px;
    height: 26px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const TypeWrapper = styled.div`
  display: flex;
  padding: 0 10px;
  margin-bottom: 25px;
`;

const SearchBg = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  padding: 0 25px;
  height: 72px;
  display: flex;
  align-items: center;
`;

const TabIcon = styled.span`
  display: block;
  width: 100%;
  height: 100%;
`;

const DateWrap = styled.div`
  display: flex;
  width: 100%;

  & > div {
    flex: 1;
    position: relative;
    border: none;

    &:first-child {
      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        height: 100%;
        color: red;
        right: 10px;
        top: 0;
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
              {opt.type === "voice" && <Microphone style={{ fill: "#fff" }} />}
              {opt.type === "text" && <Search style={{ fill: "#fff" }} />}
              {opt.type === "date" && <DateIcon style={{ fill: "#fff" }} />}
            </TypeIcon>
          ))}
        </TypeWrapper>
        <SearchBg>
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
              <FlatControl
                type="date"
                onChange={value => {
                  console.log(value);
                }}
                value=""
                placeholder="Start date"
                leftIcon="date"
              />
              <FlatControl
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
