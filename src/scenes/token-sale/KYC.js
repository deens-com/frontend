import React from 'react';
import { kycIframeUrl, kycTelegramBotId } from 'libs/config';
import styled from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  padding-bottom: 50px;
`;

export default class KYC extends React.Component {
  componentDidMount() {
    this.loadIFrame(this.props.kycToken);
    this.loadTelegramPassport(this.props.kycToken);
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
          'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE;PROOF_OF_RESIDENCE:UTILITY_BILL',
      });
    };
  }

  loadTelegramPassport(accessToken) {
    const addScript = document.createElement('script');
    addScript.setAttribute('src', '/telegram-passport.js');
    document.body.appendChild(addScript);

    addScript.onload = function() {
      window.Telegram.Passport.createAuthButton(
        'telegram_passport_auth',
        {
          bot_id: kycTelegramBotId,
          scope: { data: [{ type: 'id_document', selfie: true }, 'address_document'], v: 1 },
          public_key:
            '-----BEGIN PUBLIC KEY-----\n' +
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz4BVYGm1jd+ow5NWkIJM\n' +
            '3C1kvob5KBFHgqL+PQvATSrUkCDsod9cuL7gWOUez5l6yld7xkspXPcv5SwdJJ8v\n' +
            '1vPbdDazrEb+pMExbE1d1AFyEDLxOgeJ4O2FM2RsxEoVhaV9UnNKFMugru54EKmI\n' +
            'IUREG67UL+2dvk4HPWIh/tkjz++pQVO0fM/bw0Cx2qBIpofZiP/dvYADDG4UDIvu\n' +
            'OxWkwp5+2rzB4kkV1BaDANVu0A8N3dE4Mdu5NvFKlyz0Vp0BRgH9Gc8FphjAZHNV\n' +
            'wmJodKL+R9xAjmE/nTaTCxoan15Q2j4IZvGdBPhCq9eK+BNxhuJK0mgO+KCQvCJp\n' +
            'lwIDAQAB\n' +
            '-----END PUBLIC KEY-----',
          nonce: accessToken,
        },
        {
          text: 'KYC Check via Telegram Passport', // custom text
        },
      );
    };
  }

  render() {
    return (
      <Wrapper>
        <div id="idensic" />
        <div id="telegram_passport_auth" />
      </Wrapper>
    );
  }
}
