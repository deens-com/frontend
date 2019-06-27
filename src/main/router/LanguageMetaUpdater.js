import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getUserLanguage, availableLanguages } from 'libs/language';
import { websiteUrl } from 'libs/config';

document.documentElement.setAttribute('lang', getUserLanguage());

const LanguageMetaUpdater = ({ location }) => (
  <Helmet>
    {/*availableLanguages.map(lang => {
      if (lang !== 'en') {
        return (
          <link
            rel="alternate"
            href={`${websiteUrl}/${lang}${location.pathname}`}
            hreflang={lang}
            key={lang}
          />
        );
      }
      return (
        <link rel="alternate" href={`${websiteUrl}${location.pathname}`} hreflang="x-default" />
      );
    })*/}
    <meta http-equiv="content-language" content={getUserLanguage()} />
    <meta name="Language" content={getUserLanguage()} />
  </Helmet>
);

export default LanguageMetaUpdater;
