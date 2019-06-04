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
    const response = await apiClient.moderation.getAllPending()({});
    this.setState({ pendingList: response.data });
  }

  render() {
    const { pendingList } = this.state;
    if (pendingList.length === 0) return null;
    return (
      <Wrapper>
        {pendingList.map(trip => (
          <TripModeration trip={trip} />
        ))}
      </Wrapper>
    );
  }
}

export default AdminModerationContainer;
