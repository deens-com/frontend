import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

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
      timeLeft: props.expireDate - moment().valueOf(),
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

    const timeLeft = this.props.expireDate - moment().valueOf();

    if (timeLeft <= 0) {
      clearInterval(this.interval);
      this.props.onTimeout();
    }

    this.setState({
      timeLeft,
    });
  };

  render() {
    const duration = moment.duration(this.state.timeLeft, 'milliseconds');
    const minutes = String(duration.minutes()).padStart(2, '0');
    const seconds = String(duration.seconds()).padStart(2, '0');
    return (
      <Wrapper>
        <Text>
          <Trans>Time to book</Trans>
        </Text>
        {minutes}:{seconds}
      </Wrapper>
    );
  }
}
