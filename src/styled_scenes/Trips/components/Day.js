// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Col from "../../../components/layout/Col";
import Row from "../../../components/layout/Row";
import Button from "../../../components/Button";
import DetailCart from "../../../components/Carts/DetailCart";
import DropPicker from "../../../components/DropPicker";
import Trigger from "../../../components/DropPicker/Trigger";
import Drop from "../../../components/DropPicker/Drop";
import DropItem from "../../../components/DropPicker/DropItem";

// ACTIONS/CONFIG
import { media } from "../../../libs/styled";

// STYLES
import { Mute } from "./styles";

const Wrap = styled.div`
  margin-bottom: 50px;
`;

export const Header = styled.div`
  margin: 0 -10px 25px;

  h4 {
    font-size: 24px;
    margin-right: auto;
  }

  ${media.minSmall} {
    margin: 0 0 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const DayTag = styled.span`
  margin-right: 10px;
`;

const DayTitle = styled.h4`
  margin-bottom: 15px;
  padding-left: 15px;

  ${media.minSmall} {
    padding-left: 0;
    margin-bottom: 0;
  }
`;

const DayButtons = styled.div`
  display: flex;
  padding-left: 15px;
  margin-bottom: 15px;

  & > div:first-child {
    order: 1;
  }

  ${media.minSmall} {
    padding-left: 0;
    margin-bottom: 0;

    & > div:first-child {
      order: 0;
    }
  }
`;

// MODULE
export default class TripDay extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      opening: false,
      closing: false
    };
    this.toggleExpansion = this.toggleExpansion.bind(this);
  }

  toggleExpansion() {
    if (this.state.expanded) {
      this.setState({ expanded: false, closing: true });
    } else {
      this.setState({ expanded: true, opening: true });
    }
  }

  componentDidUpdate() {
    if (this.state.opening || this.state.closing) {
      this.setState({ closing: false, opening: false });
    }
  }

  render() {
    // console.log('this.state', this.state);
    const { day, index } = this.props;
    return (
      <Wrap>
        <Header>
          <DayTitle>
            <DayTag>Day {index + 1}</DayTag>
            <Mute>{day.date}</Mute>
          </DayTitle>
          <DayButtons>
            <Button
              type="button"
              round
              size="small"
              iconAfter="arrowDown"
              theme="textGreen"
              onClick={this.toggleExpansion}
              text={this.state.expanded ? "Collapse all" : "Expand all"}
            />
            <DropPicker>
              <Trigger
                iconBefore="plus"
                size="small"
                round={true}
                text="Add new event"
              />
              <Drop>
                <DropItem
                  onChange={ev => {
                    console.log("onchange,place");
                  }}
                >
                  Place
                </DropItem>
                <DropItem
                  onChange={ev => {
                    console.log("onchange,food");
                  }}
                >
                  Food
                </DropItem>
                <DropItem
                  onChange={ev => {
                    console.log("onchange,activity ");
                  }}
                >
                  Activity
                </DropItem>
              </Drop>
            </DropPicker>
            {/* <Button
              type="button"
              round
              size="small"
              iconBefore="plus"
              theme="mainFilled"
              onClick={() => {
                alert('Adding new event');
              }}
              text="Add new event"
            /> */}
          </DayButtons>
        </Header>
        <div>
          {day.items.map(item => (
            <div key={item.description}>
              <DetailCart
                item={item}
                opening={this.state.opening}
                closing={this.state.closing}
              />
            </div>
          ))}
        </div>
      </Wrap>
    );
  }
}

// Props Validation
TripDay.propTypes = {};
