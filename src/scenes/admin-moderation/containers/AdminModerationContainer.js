import React from 'react';
import apiClient from 'libs/apiClient';
import TripModeration from '../components/TripModeration';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-left: 48px;
`;

class AdminModerationContainer extends React.Component {
  state = {
    pendingList: [],
  };

  async componentDidMount() {
    this.fetchPending();
  }

  fetchPending = async () => {
    const response = await apiClient.moderation.getAllPending()({});
    this.setState({ pendingList: response.data });
  };

  onSubmit = async ({ tripId, moderationStatus, comment }) => {
    await apiClient.moderation.action({ tripId, moderationStatus, comment });
    this.fetchPending();
  };

  render() {
    const { pendingList } = this.state;
    if (pendingList.length === 0) return null;
    return (
      <Wrapper>
        <h2>Trips pending moderation</h2>
        <hr />
        {pendingList.map(trip => (
          <TripModeration key={trip._id} trip={trip} onSubmit={this.onSubmit} />
        ))}
      </Wrapper>
    );
  }
}

export default AdminModerationContainer;
