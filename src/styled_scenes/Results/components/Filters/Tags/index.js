import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Dropdown from 'shared_components/Dropdown';
import TextArea from './TextArea';
import { P, PSmall, PXSmall } from 'libs/commonStyles';
import { primary } from 'libs/colors';
import uniqBy from 'lodash.uniqby';

const Content = styled.div`
  padding: 15px;
`;

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

const Tags = ({ selectedTags, suggestedTags, onApply }) => {
  const [tags, setTags] = useState(selectedTags);

  const addTag = tag => {
    setTags(uniqBy([...tags, tag], tag => tag.value));
  };

  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag.value !== tagToRemove.value));
  };

  const filteredTags = suggestedTags.filter(
    tag => !tags.find(selected => selected.value === tag.value),
  );

  const onClose = () => {
    onApply({
      tags: tags.map(tag => tag.value),
    });
  };

  const renderTag = () => {
    if (tags.length === 0) {
      return 'Tags';
    }
    if (tags.length <= 3) {
      return tags.map(tag => tag.value).join(', ');
    }

    return `${tags
      .slice(0, 3)
      .map(tag => tag.value)
      .join(', ')}, +${tags.length - 3}`;
  };

  return (
    <Dropdown onClose={onClose} trigger={renderTag()}>
      <Content>
        <P>Add tags</P>
        <TextArea
          selectedTags={tags}
          suggestedTags={filteredTags}
          addTag={addTag}
          removeTag={removeTag}
        />
        <Suggestions>
          <PSmall>Suggestions</PSmall>
          {filteredTags.slice(0, 20).map(tag => (
            <SuggestedTag key={tag.value} onClick={() => addTag(tag)}>
              {tag.value}
            </SuggestedTag>
          ))}
        </Suggestions>
      </Content>
    </Dropdown>
  );
};

Tags.propTypes = {
  onApply: PropTypes.func.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  suggestedTags: PropTypes.arrayOf(PropTypes.object),
};

Tags.defaultProps = {
  selectedTags: [],
  suggestedTags: [],
};

const mapStateToProps = state => ({
  suggestedTags: state.search.tagsOptions,
});

export default connect(mapStateToProps)(Tags);
