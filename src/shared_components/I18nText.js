import React from 'react';
//import PropTypes from 'prop-types';

/**
 * A really small component that takes an internationalized object
 * and (for now) prints the English text
 * Later we can use this component to render the user selected language
 */
function I18nText({ data }) {
  if (!data) {
    return '';
  }
  return <React.Fragment>{data['en-us'] || data}</React.Fragment>;
}

// I18nText.propTypes = {
//   data: PropTypes.object,
// };

export default I18nText;
