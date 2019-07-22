import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropdown from 'shared_components/Dropdown';
import { disabled } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const Content = styled.div`
  list-style: none;
  > li {
    padding: 5px;
    background-color: white;
    cursor: pointer;
    width: 100px;
    &:hover {
      background-color: ${disabled};
    }
  }
`;

const valueToLabel = value => {
  switch (value) {
    case 1:
      return <Trans>0-2 hrs</Trans>;
    case 2:
      return <Trans>2-5 hrs</Trans>;
    case 3:
      return <Trans>Full day</Trans>;
    case 4:
      return <Trans>Multi-day</Trans>;
    default:
      return <Trans>Duration</Trans>;
  }
};

const Duration = ({ duration, onApply }) => {
  const [isOpen, setOpen] = useState(false);
  const onUnApply = () => {
    setOpen(false);
    onApply({ duration: undefined });
  };

  const search = duration => {
    setOpen(false);
    onApply({ duration });
  };

  return (
    <Dropdown
      open={isOpen}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      trigger={valueToLabel(duration)}
    >
      <Content>
        <li onClick={duration === 1 ? onUnApply : () => search(1)}>{valueToLabel(1)}</li>
        <li onClick={duration === 2 ? onUnApply : () => search(2)}>{valueToLabel(2)}</li>
        <li onClick={duration === 3 ? onUnApply : () => search(3)}>{valueToLabel(3)}</li>
        <li onClick={duration === 4 ? onUnApply : () => search(4)}>{valueToLabel(4)}</li>
      </Content>
    </Dropdown>
  );
};

Duration.propTypes = {
  onApply: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

Duration.defaultProps = {
  duration: null,
};

export default Duration;
