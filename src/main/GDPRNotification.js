import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'main/settings/actions';
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
  cursor: pointer;
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

const GDPRBanner = ({ closed, dismissGdpr }) => {
  if (closed) {
    return null;
  }

  return (
    <Notification id="gdpr-banner" onClick={dismissGdpr}>
      <Text>
        This site uses cookies to provide you with a great user experience. By using Please.com you
        accept our use of{' '}
        <a href="#/cookie-policy" target="_blank" onClick={e => e.stopPropagation()}>
          cookies
        </a>
        .
      </Text>
      <CloseButton onClick={dismissGdpr}>
        <CrossIcon style={{ width: 24, height: 24 }} />
      </CloseButton>
    </Notification>
  );
};

const mapStateToProps = state => ({
  closed: state.SettingsReducer.gdprDismissed,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GDPRBanner);
