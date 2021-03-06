import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextArea from './TextArea';
import { uniqBy } from 'lodash';
import { PSmall, PXSmall } from 'libs/commonStyles';
import { primary } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const Suggestions = styled.div`
  margin-top: 10px;
`;

const SuggestedTag = styled(PXSmall)`
  border-radius: 2px 2px 2px 0;
  border: 1px solid ${primary};
  display: inline-block;
  margin-right: 5px;
  padding: 0 3px;
  color: ${primary};
  cursor: pointer;
`;

const TagSelector = ({ selectedTags, suggestedTags, onChange, onBlur, valueKey = 'value' }) => {
  const [tags, setTags] = useState(selectedTags);
  const textareaRef = useRef(null);

  const addTag = tag => {
    const newTags = uniqBy([...tags, tag], tag => tag[valueKey]);
    setTags(newTags);
    textareaRef.current.focus();
    onChange(newTags);
  };

  const removeTag = tagToRemove => {
    const newTags = tags.filter(tag => tag[valueKey] !== tagToRemove[valueKey]);
    setTags(newTags);
    onChange(newTags);
  };

  const filteredTags = suggestedTags.filter(
    tag => !tags.find(selected => selected[valueKey] === tag[valueKey]),
  );

  useEffect(
    () => {
      setTags(selectedTags);
    },
    [selectedTags],
  );

  return (
    <div>
      <TextArea
        selectedTags={tags}
        suggestedTags={filteredTags}
        addTag={addTag}
        removeTag={removeTag}
        autofocus
        textareaRef={textareaRef}
        onBlur={onBlur}
        valueKey={valueKey}
      />
      <Suggestions>
        <PSmall>
          <Trans>Suggestions</Trans>
        </PSmall>
        {filteredTags.slice(0, 20).map(tag => (
          <SuggestedTag
            key={tag[valueKey]}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              addTag(tag);
            }}
          >
            {tag[valueKey]} {tag.count && `(${tag.count})`}
          </SuggestedTag>
        ))}
      </Suggestions>
    </div>
  );
};

TagSelector.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

TagSelector.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
};

export default TagSelector;
