// NPM
import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import WihtColumn from "./WithColumn";

// ACTIONS/CONFIG
import { media } from "../../../../libs/styled";

// STYLES
const tagSizes = {
  large: {
    fontSize: "18px",
    minHeight: "64px",
    width: "172px",
    marginRight: "22px"
  },
  medium: {
    fontSize: "15px",
    minHeight: "40px",
    width: "96px",
    marginRight: "15px"
  },
  small: {
    fontSize: "13px",
    minHeight: "auto",
    width: "auto",
    marginRight: "8px"
  }
};

const Wrap = styled.div`
  background: ${props => props.background || "#ddd"};
  border-radius: 4px;
  box-shadow: ${props =>
    props.withShadow ? "0 8px 25px 0 rgba(141,141,141,0.22)" : "none"};
  cursor: pointer;
  display: inline-block;
  margin-bottom: 15px;
  margin-right: ${props => tagSizes[props.size].marginRight};
  overflow: hidden;
  transition: box-shadow 0.1s ease-out, background 0.1s ease-out;
  width: ${props => tagSizes[props.size].width};

  ${media.minMedium} {
    margin-bottom: 0;
  }

  &:hover {
    background: ${props => props.hoverBg || "#dd9"};
    box-shadow: ${props =>
      props.withShadow ? "0 8px 40px 0px rgba(141,141,141,0.28)" : "none"};
  }

  a {
    align-items: center;
    color: #fff;
    display: flex;
    font-size: ${props => tagSizes[props.size].fontSize};
    min-height: ${props => tagSizes[props.size].minHeight};
    justify-content: center;
    padding: ${props => (props.size === "small" ? "6px 10px" : "0")};
  }
`;

// MODULE
export default function CategoryTag(props) {
  const label_name = props.item.label.toLowerCase();
  return (
    <Wrap
      size={props.size}
      withShadow={props.withShadow}
      hoverBg={props.item.hoverBg}
      background={props.item.background}
    >
      <button
        style={{
          color: props.search_query.tags.includes(label_name) ? "black" : ""
        }}
        onClick={() =>
          props.toggle_tag_from_search_query(props.search_query, label_name)
        }
      >
        {props.item.label}
      </button>
    </Wrap>
  );
}

// Props Validation
CategoryTag.propTypes = {
  size: PropTypes.string,
  withShadow: PropTypes.bool,
  item: PropTypes.shape({
    hoverBg: PropTypes.string,
    background: PropTypes.string,
    label: PropTypes.string
  }).isRequired
};

// Default Props
CategoryTag.defaultProps = {
  size: "small",
  withShadow: false
};
