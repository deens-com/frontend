import React from 'react';
import Popup from 'shared_components/Popup';
import QuestionMarkIcon from 'shared_components/icons/QuestionMarkIcon';

const iconStyle = {
  cursor: 'pointer',
};

export default ({ content, style }) => (
  <Popup
    trigger={
      <span>
        <QuestionMarkIcon
          style={{
            ...iconStyle,
            ...style,
          }}
        />
      </span>
    }
    content={content}
    position="top center"
  />
);
