import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs/esm';

const Wrapper = styled.div`
  background-color: #4ac4a1;
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: auto;
  padding: 10px 30px;
  border-radius: 10px;
  text-align: center;
`;

const Text = styled.div`
  font-size: 12px;
  color: #ddd;
  font-weight: normal;
`;

export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.expireDate - dayjs().valueOf(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    if (this.props.isPaying) {
      return;
    }

    const timeLeft = this.props.expireDate - dayjs().valueOf();

    if (timeLeft <= 0) {
      clearInterval(this.interval);
      this.props.onTimeout();
    }

    this.setState({
      timeLeft,
    });
  };

  render() {
    const milliseconds = this.state.timeLeft;
    const minutes = String((milliseconds / (1000 * 60)) % 60).padStart(2, '0');
    const seconds = String((milliseconds / 1000) % 60).padStart(2, '0');
    return (
      <Wrapper>
        <Text>Time to book</Text>
        {minutes}:{seconds}
      </Wrapper>
    );
  }
}
