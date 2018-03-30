// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import Col from "../../../shared_components/layout/Col";
import Button from "../../../shared_components/Button";

// ACTIONS/CONFIG
import Utils from "../../../libs/Utils";
import { media } from "../../../libs/styled";

// STLYES
const Wrap = styled.div`
  ${media.minMedium} {
    display: flex;
  }
`;

const LeftCol = styled.div`
  padding: 25px;

  ${media.minMedium} {
    width: 50%;
    padding: 50px 25px;
  }
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DetailPrice = styled.p`
  font-weight: 500;
  text-align: right;

  span {
    font-weight: 300;
    display: block;
    font-size: 13px;
    color: #6e7885;
  }
`;

const RightCol = styled.div`
  padding: 0 25px 50px 25px;

  ${media.minMedium} {
    width: 50%;
    padding: 50px 25px;
  }
`;

const TotalWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const TotalPrice = styled.p`
  font-size: 28px;
  font-weight: 500;
`;

const TotalHint = styled.p`
  color: #6e7885;
  font-size: 13px;
  max-width: 240px;

  a {
    color: #5fb79e;
  }
`;

// MODULE
export default class TripSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: {},
      total: 0
    };

    this.getTripSummaryCategories = this.getTripSummaryCategories.bind(this);
  }

  componentDidMount() {
    this.setState({ ...this.getTripSummaryCategories() });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ ...this.getTripSummaryCategories() });
    }
  }

  getTripSummaryCategories() {
    const summary = {};
    let total = 0;
    this.props.data.forEach(day => {
      day.items.forEach(item => {
        if (!summary[item.category]) {
          summary[item.category] = {
            items: 0,
            count: 0
          };
        }
        summary[item.category].items += 1;
        summary[item.category].count += Number(item.price);
        total += Number(item.price);
      });
    });
    return { summary, total };
  }

  render() {
    return (
      <Wrap>
        <LeftCol xsBasis="100%" mdBasis="50%">
          {Object.keys(this.state.summary).map(category => (
            <Detail key={category}>
              <span>
                {this.state.summary[category].items} x {category}
              </span>
              <DetailPrice>
                {this.state.summary[category].count}{" "}
                {Utils.getBaseSymbol("EUR")}
                {this.state.summary[category].count < 1 && (
                  <span>You pay on spot</span>
                )}
              </DetailPrice>
            </Detail>
          ))}
        </LeftCol>
        <RightCol xsBasis="100%" mdBasis="50%">
          <p>Total</p>
          <TotalWrap>
            <TotalPrice>
              {this.state.total} {Utils.getBaseSymbol("EUR")}
            </TotalPrice>
            <Button href="#" round size="small" theme="mainFilled" type="link">
              Book now
            </Button>
          </TotalWrap>
          <TotalHint>
            Trip is not saved! Please <Link to="#">Sign Up</Link> or{" "}
            <Link to="#">Login</Link> in order to save tre trip.
          </TotalHint>
        </RightCol>
      </Wrap>
    );
  }
}

// Props Validation
TripSummary.propTypes = {};
