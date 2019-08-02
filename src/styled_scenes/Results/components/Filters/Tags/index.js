import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Dropdown from 'shared_components/Dropdown';
import { P } from 'libs/commonStyles';
import TagSelector from 'shared_components/TagSelector';

// i18n
import { Trans } from '@lingui/macro';

const Content = styled.div`
  padding: 15px;
`;

const Tags = ({ selectedTags, suggestedTags, onApply, isAmenitiesFilter, customSuggestedTags }) => {
  const [tags, setTags] = useState(selectedTags);
  const [isOpen, setIsOpen] = useState(false);

  const valueKey = isAmenitiesFilter ? 'names' : 'value';

  const onClose = () => {
    setIsOpen(false);
    if (!isAmenitiesFilter) {
      onApply({
        tags: tags.length === 0 ? undefined : tags.map(tag => tag.value),
      });
      return;
    }
    onApply({
      accommodationAmenities: tags.length === 0 ? undefined : tags.map(tag => tag._id),
    });
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const renderTag = () => {
    if (tags.length === 0) {
      return isAmenitiesFilter ? <Trans>Amenities</Trans> : <Trans>Tags</Trans>;
    }
    if (tags.length <= 3) {
      return tags.map(tag => tag[valueKey]).join(', ');
    }

    return `${tags
      .slice(0, 3)
      .map(tag => tag[valueKey])
      .join(', ')}, +${tags.length - 3}`;
  };

  return (
    <Dropdown onClose={onClose} onOpen={onOpen} trigger={renderTag()}>
      <Content>
        {isOpen && (
          <TagSelector
            selectedTags={selectedTags}
            suggestedTags={customSuggestedTags || suggestedTags}
            onChange={setTags}
            valueKey={valueKey}
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
  customSuggestedTags: PropTypes.arrayOf(PropTypes.object),
  isAmenitiesFilter: PropTypes.bool,
};

Tags.defaultProps = {
  selectedTags: [],
  suggestedTags: [],
  isAmenitiesFilter: false,
};

const mapStateToProps = state => ({
  suggestedTags: state.search.tagsOptions,
});

export default connect(mapStateToProps)(Tags);
