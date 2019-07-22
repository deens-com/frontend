import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getImageUrlFromMedia } from 'libs/media';
import { H2, P } from 'libs/commonStyles';
import CopyToClipboard from 'shared_components/icons/CopyToClipboard';
import Popup from 'shared_components/Popup';
import { generateTripSlug, waitForAddThis } from 'libs/Utils';
import urls from 'libs/urlGenerator';
import { websiteUrl } from 'libs/config';
import { primary } from 'libs/colors';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const copyColor = '#656F76';

const CopyIcon = styled.div`
  color: #c4c4c4;
  flex-shrink: 1;
  justify-self: flex-end;
  cursor: pointer;
  margin-left: 15px;
  align-items: center;
  &:hover {
    color: #12545f;
  }
  display: flex;
  color: ${copyColor};
  > p {
    margin-left: 5px;
  }
`;

const Copy = styled.div`
  display: flex;
  margin-top: 50px;
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  font-weight: 300;
  padding: 5px;
  ${props => (props.small ? 'font-size: 16px' : 'font-size: 24px')};
`;

const ShareData = ({ trip, title, small }) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const inputRef = useRef(null);
  const onCopy = () => {
    const input = inputRef.current;
    input.focus();
    input.select();
    document.execCommand('copy');
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };
  useEffect(() => {
    waitForAddThis().then(() => {
      window.addthis.layers.refresh();
    });
  }, []);

  const tripUrl = `${websiteUrl}${urls.trip.view({
    slug: generateTripSlug(trip),
    id: trip._id,
  })}`;
  return (
    <div style={{ textAlign: 'center', flex: 1, maxWidth: '100%' }}>
      <H2>{title}</H2>
      <Copy>
        <Input small={small} ref={inputRef} value={tripUrl} />
        <I18n>
          {({ i18n }) => (
            <Popup
              trigger={
                <CopyIcon>
                  <CopyToClipboard
                    style={{
                      width: small ? '1em' : '2em',
                      height: small ? '1em' : '2em',
                      transform: 'rotateY(180deg)',
                    }}
                  />
                  <P>
                    <Trans>Copy</Trans>
                  </P>
                </CopyIcon>
              }
              content={i18n._(t`Copied to clipboard`)}
              inverted
              on="click"
              open={copiedToClipboard}
              position="bottom center"
              onOpen={onCopy}
            />
          )}
        </I18n>

        <a
          href={tripUrl}
          rel="noopener noreferrer"
          target="_blank"
          style={{
            marginTop: '2px',
            color: primary,
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
          }}
        >
          <svg
            style={{ marginRight: '5px' }}
            width={small ? 14 : 24}
            height={small ? 14 : 24}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2342 3.23411L11.411 3.05733L11.2342 2.88056L8.60363 0.25H15.7501V7.39645L13.1195 4.76589L12.9427 4.58911L12.766 4.76589L8.00008 9.53178L6.4683 8L11.2342 3.23411Z"
              fill="#097DA8"
              stroke="white"
              stroke-width="0.5"
            />
            <path
              d="M13.3333 13.5833C13.4714 13.5833 13.5833 13.4714 13.5833 13.3333V10.9167H15.75V13.3333C15.75 13.9743 15.4954 14.589 15.0422 15.0422C14.589 15.4954 13.9743 15.75 13.3333 15.75H2.66667C2.02573 15.75 1.41104 15.4954 0.957825 15.0422C0.504612 14.589 0.25 13.9743 0.25 13.3333V2.66667C0.25 2.02573 0.504612 1.41104 0.957825 0.957825C1.41104 0.504612 2.02573 0.25 2.66667 0.25H5.08333V2.41667H2.66667C2.5286 2.41667 2.41667 2.5286 2.41667 2.66667V13.3333C2.41667 13.4714 2.5286 13.5833 2.66667 13.5833H13.3333Z"
              fill="#097DA8"
              stroke="white"
              stroke-width="0.5"
              stroke-linejoin="round"
            />
          </svg>
          <span>
            <Trans>View</Trans>
          </span>
        </a>
      </Copy>
      <H2>
        <Trans>Spread the word!</Trans>
      </H2>
      <div
        style={{ marginTop: '25px', textAlign: 'left' }}
        className="addthis_inline_share_toolbox"
        data-url={tripUrl}
        data-title={trip.title}
        data-description={trip.description}
        data-media={getImageUrlFromMedia(trip.media)}
      />
    </div>
  );
};

ShareData.propTypes = {
  title: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

export default ShareData;
