import React from 'react';
import { Popup } from 'semantic-ui-react';
import { isIosDevice } from 'libs/Utils';

const FixedPopup = props => (
  <Popup
    {...props}
    onOpen={(...args) => {
      if (isIosDevice) {
        document.body.style.cursor = 'pointer';
      }
      if (props.onOpen) {
        props.onOpen(...args);
      }
    }}
    onClose={(...args) => {
      if (isIosDevice) {
        document.body.style.cursor = 'initial';
      }
      if (props.onClose) {
        props.onClose(...args);
      }
    }}
  />
);

FixedPopup.Content = Popup.Content;
FixedPopup.Header = Popup.Header;

export default FixedPopup;
