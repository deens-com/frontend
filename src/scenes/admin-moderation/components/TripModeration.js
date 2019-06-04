import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'shared_components/Button';
import I18nText from 'shared_components/I18nText';
import styled from 'styled-components';

const TextArea = styled.textarea`
  padding: 5px;
  font-size: 14px;
  min-height: 60px;
  max-width: 600px;
  width: 100%;
`;

const ActionArea = styled.div`
  display: flex;
  > div {
    margin-left: 20px;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

class TripModeration extends React.Component {
  static propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.shape({ 'en-us': PropTypes.string.isRequired }),
    }),
  };

  render() {
    const { trip } = this.props;
    if (!trip) return null;
    return (
      <Wrapper>
        <h3>
          <Link to={`/trips/_${trip._id}`}>
            <I18nText data={trip.title} />
          </Link>
        </h3>
        <ActionArea>
          <TextArea />
          <Button theme="fillLightGreen" onClick={this.approveClick}>
            Approve
          </Button>
          <Button theme="danger" onClick={this.rejectClick}>
            Reject
          </Button>
        </ActionArea>
      </Wrapper>
    );
  }
}

export default TripModeration;
