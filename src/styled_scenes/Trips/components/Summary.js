// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import Parse from 'parse';

// COMPONENTS
import PriceTag from '../../../shared_components/Currency/PriceTag';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

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

const RightCol = styled.div`
  padding: 0 25px 50px 25px;

  ${media.minMedium} {
    width: 50%;
    padding: 50px 25px;
  }
`;

const TotalHint = styled.p`
  color: #6e7885;
  font-size: 13px;
  max-width: 240px;

  a {
    color: #5fb79e;
  }
`;

const BookButton = styled(Button)`
  && {
    color: #fff;
    background-color: #5eb89e;
    border: 1px solid #5fb79e;
    :hover,
    :focus {
      color: #fff;
      background: #4ac4a1;
      border: 1px solid #5fb79e;
    }
  }
`;

// MODULE
export default class TripSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      total: 0,
      services: [],
    };
  }

  componentDidMount() {
    if (Parse.User.current() === null) {
      this.setState({ logged_in: false });
    } else {
      this.setState({ logged_in: true });
    }
  }

  calculateTripTotalPrice() {
    let totalPrice = 0;

    this.props.scheduledServices.forEach(item => {
      item.services.forEach(service => {
        totalPrice += service.pricePerSession;
      });
    });

    return totalPrice;
  }

  onBookClickWithDates = () => {
    this.props.onBookClick(this.props.startDate, this.props.peopleCount);
  };

  render() {
    return (
      <Wrap>
        <LeftCol xsBasis="100%" mdBasis="50%">
          {/* kept this left block intact while removing service category counts */}
          {/* becuase looks like it could be used for something */}
        </LeftCol>
        <RightCol xsBasis="100%" mdBasis="50%">
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column stretched>Price per person</Grid.Column>
              <Grid.Column textAlign="right">
                <PriceTag price={this.calculateTripTotalPrice()} unit="hidden" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column stretched>Total Price</Grid.Column>
              <Grid.Column textAlign="right">
                <PriceTag price={this.calculateTripTotalPrice() * this.props.peopleCount} unit="hidden" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column textAlign="right">
                <BookButton
                  size="small"
                  circular
                  onClick={this.onBookClickWithDates}
                  loading={this.props.isCloningInProcess}
                >
                  Book now
                </BookButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {!this.state.logged_in && (
            <TotalHint>
              Trip is not saved! Please <Link to="/register">Sign Up</Link> or <Link to="/login">Login</Link> in order
              to save tre trip.
            </TotalHint>
          )}
        </RightCol>
      </Wrap>
    );
  }
}

// Props Validation
TripSummary.propTypes = {
  onBookClick: PropTypes.func.isRequired,
  isCloningInProcess: PropTypes.bool.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  peopleCount: PropTypes.string,
};
