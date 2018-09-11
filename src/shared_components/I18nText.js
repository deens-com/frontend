import React from 'react';
import PropTypes from 'prop-types';

/**
 * A really small component that takes an internationalized object
 * and (for now) prints the English text
 * Later we can use this component to render the user selected language
 */
function I18nText({ data }) {
  return <React.Fragment>{data['en-us']}</React.Fragment>;
}

I18nText.propTypes = {
  data: PropTypes.object.isRequired,
};

export default I18nText;
