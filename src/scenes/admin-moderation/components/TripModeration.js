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
  margin-top: 24px;
  margin-bottom: 24px;
`;

class TripModeration extends React.Component {
  static propTypes = {
    trip: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.shape({ 'en-us': PropTypes.string.isRequired }),
    }),
  };

  descInput = React.createRef();

  onApproveClick = () => {
    const { trip } = this.props;
    this.props.onSubmit({
      tripId: trip._id,
      moderationStatus: 'approved',
      comment: this.descInput.current.value,
    });
  };

  onRejectClick = () => {
    const { trip } = this.props;
    this.props.onSubmit({
      tripId: trip._id,
      moderationStatus: 'rejected',
      comment: this.descInput.current.value,
    });
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
          <TextArea ref={this.descInput} />
          <Button theme="fillLightGreen" onClick={this.onApproveClick}>
            Approve
          </Button>
          <Button theme="danger" onClick={this.onRejectClick}>
            Reject
          </Button>
        </ActionArea>
      </Wrapper>
    );
  }
}

export default TripModeration;
