// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import Col from '../../../components/layout/Col';
import Row from '../../../components/layout/Row';
import TripCart from '../../../components/Carts/Trip';
import Button from '../../../components/Button';
import DetailCart from '../../../components/Carts/DetailCart';
import Day from './Day';

// ACTIONS/CONFIG
import theme from '../../../config/theme';
import { media } from '../../../libs/styled';
import { trip } from '../../../data/trip';

// STYLES
import { Highlight, Header } from './styles';

const Wrap = styled.div`
  padding: 25px;
  padding-top: 125px;

  ${media.minMedium} {
    padding-top: 25px;
  }
`;

// MODULE
export default function Results({ data, showDetails }) {
  // console.log(Button);
  return (
    <Wrap>
      {!showDetails && (
        <Header>
          <h4>
            Most popular trips to <Highlight>New York</Highlight>
          </h4>
          <Button
            type="button"
            round
            size="small"
            theme={{ ...theme.button.mainFilled }}
            onClick={ev => {
              alert('Creating your event');
            }}
            text="Create your own trip"
          />
        </Header>
      )}
      {showDetails ? (
        trip.map((day, index) => <Day key={day.date} day={day} index={index} />)
      ) : (
        <Row>
          {data.map(item => (
            <Col key={item.title} xsBasis="50%" lgBasis="25%">
              <TripCart item={item} />
            </Col>
          ))}
        </Row>
      )}
    </Wrap>
  );
}

// Props Validation
Results.propTypes = {};
