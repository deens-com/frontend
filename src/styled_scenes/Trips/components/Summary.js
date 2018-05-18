// NPM
import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import fetch_helpers from "./../../../libs/fetch_helpers";
import Parse from "parse";

// COMPONENTS
import Button from "../../../shared_components/Button";
import PriceTag from "../../../shared_components/Currency/PriceTag";

// ACTIONS/CONFIG
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

const DetailPrice = styled.div`
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

const TotalPrice = styled.div`
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
      logged_in: false,
      summary: {},
      total: 0
    };

    this.getTripSummaryCategories = this.getTripSummaryCategories.bind(this);
  }

  componentDidMount() {
    this.setState({ ...this.getTripSummaryCategories() });

    if(Parse.User.current() === null){
      this.state.logged_in = false;
    }else{
      this.state.logged_in = true;
    }
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
                <PriceTag price={this.state.summary[category].count} unit="hidden" />

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
              <PriceTag price={this.state.total} unit="hidden" />
            </TotalPrice>
            <Button href="#" round size="small" theme="mainFilled" type="link">
              Book now
            </Button>
          </TotalWrap>
          {!this.state.logged_in &&
            <TotalHint>
              Trip is not saved! Please <Link to="/register">Sign Up</Link> or{" "}
              <Link to="/login">Login</Link> in order to save tre trip.
            </TotalHint>
          }
        </RightCol>
      </Wrap>
    );
  }
}

// Props Validation
TripSummary.propTypes = {};
