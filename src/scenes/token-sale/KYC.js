import React from 'react';
import { Loader } from 'semantic-ui-react';
export default class KYC extends React.Component {
  componentDidMount(prevProps) {
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
