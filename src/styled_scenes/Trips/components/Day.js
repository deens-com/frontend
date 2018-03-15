// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import Col from '../../../components/layout/Col';
import Row from '../../../components/layout/Row';
import Button from '../../../components/Button';
import DetailCart from '../../../components/Carts/DetailCart';

// ACTIONS/CONFIG
import theme from '../../../config/theme';

// STYLES
import { Mute, Header } from './styles';

const Wrap = styled.div`
  margin-bottom: 50px;
`;

// MODULE
export default function TripDay({ day, index }) {
  return (
    <Wrap>
      <Header>
        <h4>
          Day {index + 1} <Mute>{day.date}</Mute>
        </h4>
        <Button
          type="button"
          round
          size="small"
          theme={{ ...theme.button.mainFilled }}
          onClick={ev => {
            alert('Creating new trip!');
          }}
          text="Expand all"
        />
        <Button
          type="button"
          round
          size="small"
          theme={{ ...theme.button.mainFilled }}
          onClick={() => {
            alert('Adding new event');
          }}
          text="Add new event"
        />
      </Header>
      <div>
        {day.items.map(item => (
          <div key={item.description}>
            <DetailCart item={item} />
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// Props Validation
TripDay.propTypes = {};
