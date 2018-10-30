import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { isGDPRDismissed, dismissGDPRBanner } from 'libs/feature-flags';
import { CrossIcon } from 'shared_components/icons';

const Notification = styled.div`
  background-color: rgba(210, 236, 241, 0.98);
  position: fixed;
  bottom: 0;
  min-height: 50px;
  border-top: 1px solid #7dd7e5;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding-right: 30px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  ${media.minSmall} {
    padding-right: 0;
  }
`;

const Text = styled.span`
  color: #12545f;
  > a {
    color: #6fcf97;
  }
`;

const CloseButton = styled.span`
  color: #12545f;
  position: absolute;
  right: 10px;
  cursor: pointer;
  > svg {
    width: 22px;
    height: 22px;
  }
`;

export default class GDPRBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: isGDPRDismissed(),
    };
  }

  close = () => {
    this.setState({
      closed: true,
    });
    dismissGDPRBanner();
  };

  render() {
    if (this.state.closed) {
      return null;
    }

    return (
      <Notification>
        <Text>
          This site uses cookies to provide you with a great user experience. By using Please.com
          you accept our use of{' '}
          <a href="#/cookie-policy" target="_blank">
            cookies
          </a>
          .
        </Text>
        <CloseButton onClick={this.close}>
          <CrossIcon style={{ width: 24, height: 24 }} />
        </CloseButton>
      </Notification>
    );
  }
}
