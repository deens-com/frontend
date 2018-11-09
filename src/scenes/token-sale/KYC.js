import React from 'react';
import { kycIframeUrl } from 'libs/config';

export default class KYC extends React.Component {
  componentDidMount() {
    this.loadIFrame(this.props.kycToken);
  }

  loadIFrame(accessToken) {
    const addScript = document.createElement('script');
    addScript.setAttribute('src', kycIframeUrl);
    document.body.appendChild(addScript);

    addScript.onload = function() {
      window.idensic.init('#idensic', {
        accessToken,
        excludedCountries: ['CHN'],
        userAgreementUrl: 'https://vision.please.com/assets/terms.pdf',
        privacyPolicyUrl: 'https://vision.please.com/assets/privacy.pdf',
        requiredDocuments:
          'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE;PROOF_OF_RESIDENCE:UTILITY_BILL,BANK_STATEMENT,OTHER',
      });
    };
  }

  render() {
    return <div id="idensic" />;
  }
}
