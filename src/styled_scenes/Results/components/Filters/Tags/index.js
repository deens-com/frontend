import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Dropdown from 'shared_components/Dropdown';
import { P } from 'libs/commonStyles';
import TagSelector from 'shared_components/TagSelector';

const Content = styled.div`
  padding: 15px;
`;

const Tags = ({ selectedTags, suggestedTags, onApply }) => {
  const [tags, setTags] = useState(selectedTags);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    onApply({
      tags: tags.length === 0 ? undefined : tags.map(tag => tag.value),
    });
  };

  const onOpen = () => {
    setIsOpen(true);
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
    <Dropdown onClose={onClose} onOpen={onOpen} trigger={renderTag()}>
      <Content>
        <P>Add tags</P>
        {isOpen && (
          <TagSelector
            selectedTags={selectedTags}
            suggestedTags={suggestedTags}
            onChange={setTags}
          />
        )}
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
