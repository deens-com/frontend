import React, { useRef, useEffect, useState } from 'react';
import Note from 'shared_components/icons/Note';
import { Popup } from 'semantic-ui-react';

export default ({ setNotes, serviceOrg }) => {
  const note = serviceOrg.notes && serviceOrg.notes[0] && serviceOrg.notes[0]['en'];
  const [isOpen, setIsOpen] = useState(false);
  const textAreaRef = useRef(null);
  useEffect(() => {
    if (textAreaRef.current) {
      if (document.activeElement !== textAreaRef.current) {
        textAreaRef.current.focus({
          preventScroll: true,
        });
      }
    }
  });

  const onClose = () => {
    const newValue = textAreaRef.current.value;
    if (newValue !== note) {
      setNotes(newValue, serviceOrg._id);
    }
    setIsOpen(false);
  };

  return (
    <Popup
      trigger={
        <div style={{ cursor: 'pointer', opacity: note ? 1 : 0.3 }}>
          <Note />
        </div>
      }
      on="click"
      position="bottom center"
      content={
        <div style={{ width: '200px' }}>
          <textarea ref={textAreaRef} style={{ width: '100%' }} defaultValue={note || ''} />
        </div>
      }
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={onClose}
    />
  );
};
