// NPM
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import Media from "react-media";

// COMPONENTS
import Button from "../../../Button";
import { PinIcon, PencilIcon } from "../../../icons";
import { ClockIcon, PhoneIcon } from "./icons";

// ACTIONS/CONFIG
import { sizes, media } from "../../../../libs/styled";

// STYLES
const Detail = styled.div`
  display: ${props => (props.block ? "flex" : "inline-flex")};
  align-items: center;
  height: 24px;
  font-size: 12px;

  ${media.minMedium} {
    font-size: 16px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const LeftIcon = styled.span`
  display: inline-block;
  margin-right: 5px;
  width: 15px;
  color: #d3d7dc;
`;

const Text = styled.span`
  display: inline-block;

  ${media.minMedium} {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const EditWrap = styled.div`
  display: inline-block;
  margin-left: 5px;
  width: 16px;

  div {
    width: 100%;
  }

  & button svg {
    fill: #d3d7dc;
  }
`;

// MODULE
export default class CartDetail extends Component {
  constructor() {
    super();
    this.state = {
      showEdit: false
    };

    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
    this.setState({ showEdit: !this.state.showEdit });
  }

  getIcon(icon) {
    switch (icon) {
      case "clock": {
        return <ClockIcon />;
      }
      case "pin": {
        return <PinIcon />;
      }
      case "phone": {
        return <PhoneIcon />;
      }
      default:
        return "LI";
    }
  }

  render() {
    return (
      <Detail
        block={this.props.block}
      >
        {this.props.icon && (
          <LeftIcon>{this.getIcon(this.props.icon)}</LeftIcon>
        )}
        <Text>{this.props.text}</Text>
        {this.props.showEdit && this.state.showEdit && (
          <Media
            query={`(min-width: ${sizes.large})`}
            render={() => (
              <EditWrap>
                <Button
                  type="button"
                  theme="icon"
                  size="text"
                  onClick={ev => {
                    alert("editing");
                  }}
                >
                  <PencilIcon />
                </Button>
              </EditWrap>
            )}
          />
        )}
      </Detail>
    );
  }
}

// Props Validation
CartDetail.propTypes = {
  showEdit: PropTypes.bool.isRequired,
};
