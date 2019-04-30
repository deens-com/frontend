import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TextArea = ({ autoexpand, ...props }, ref) => {
  const alternativeRef = useRef(null);
  const currentRef = ref || alternativeRef;
  const [height, setHeight] = useState(currentRef.current ? currentRef.current.scrollHeight : null);

  const resize = current => {
    if (autoexpand) {
      const scroll = current.scrollHeight;
      if (scroll > 0) {
        const diff = current.offsetHeight - current.clientHeight;
        setHeight(scroll + diff);
      }
    }
  };

  useEffect(() => resize(currentRef.current), []);

  const onChange = event => resize(event.target);

  return (
    <textarea
      {...props}
      onInput={onChange}
      ref={currentRef}
      {...(autoexpand ? { style: { height, resize: 'none', overflow: 'hidden' } } : {})}
    />
  );
};

TextArea.propTypes = {
  autoexpand: PropTypes.bool,
  defaultRows: PropTypes.number,
};

TextArea.defaultProps = {
  autoexpand: false,
  defaultRows: 3,
};

export default React.forwardRef(TextArea);
