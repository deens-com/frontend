import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropdown from 'shared_components/Dropdown';
import { primary, disabled, primaryHover } from 'libs/colors';
import Star from 'shared_components/icons/Star';

const Content = styled.div`
  padding: 15px;
  width: 125px;
`;

const Option = styled.label`
  display: flex;
  margin-bottom: 5px;
  cursor: pointer;
  align-items: center;
  padding: 5px 0;
  color: ${props => (props.selected ? primary : disabled)};
  &:hover {
    svg {
      color: ${primaryHover};
    }
  }
`;

const generateStars = length => Array.apply(null, { length }).map((_, i) => <Star key={i} />);

const options = [
  generateStars(1),
  generateStars(2),
  generateStars(3),
  generateStars(4),
  generateStars(5),
];

const Stars = ({ accommodationStars, onApply }) => {
  const [selected, setSelected] = useState(accommodationStars.sort());

  useEffect(
    () => {
      setSelected(accommodationStars.sort());
    },
    [accommodationStars],
  );

  const onChange = e => {
    if (e.target.checked) {
      setSelected([...selected, Number(e.target.name)].sort());
      return;
    }
    setSelected(selected.filter(num => num !== Number(e.target.name)));
  };

  const onClose = () => {
    onApply({
      accommodationStars: selected.length !== 0 ? selected : undefined,
    });
  };

  return (
    <Dropdown
      onClose={onClose}
      trigger={selected.length === 0 ? 'Select stars' : `${selected.join(', ')} stars`}
    >
      <Content>
        {options.map((stars, i) => (
          <Option key={i} selected={selected.includes(i + 1)}>
            <input
              checked={selected.includes(i + 1)}
              name={i + 1}
              onChange={onChange}
              type="checkbox"
              style={{ marginRight: '5px' }}
            />
            {stars}
          </Option>
        ))}
      </Content>
    </Dropdown>
  );
};

Stars.propTypes = {
  onApply: PropTypes.func.isRequired,
  accommodationStars: PropTypes.arrayOf(PropTypes.number),
};

Stars.defaultProps = {
  accommodationStars: [],
};

export default Stars;
