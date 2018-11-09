import React from 'react';

export default class KYC extends React.Component {
  componentDidMount() {
    this.loadIFrame(this.props.kycToken);
  }

  loadIFrame(accessToken) {
    window.idensic.init('#idensic', {
      accessToken,
      requiredDocuments:
        'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE;PROOF_OF_RESIDENCE:UTILITY_BILL,BANK_STATEMENT,OTHER',
    });
  }

  render() {
    return <div id="idensic" />;
  }
}
