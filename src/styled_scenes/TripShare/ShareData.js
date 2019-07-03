import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H2, P } from 'libs/commonStyles';
import CopyToClipboard from 'shared_components/icons/CopyToClipboard';
import { Popup } from 'semantic-ui-react';
import { generateTripSlug } from 'libs/Utils';
import urls from 'libs/urlGenerator';
import { websiteUrl } from 'libs/config';

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
  align-items: center;
  justify-content: center;
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
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <H2>{title}</H2>
      <Copy>
        <Input
          small={small}
          ref={inputRef}
          value={`${websiteUrl}${urls.trip.view({
            slug: generateTripSlug(trip),
            id: trip._id,
          })}`}
        />
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
              <P>Copy</P>
            </CopyIcon>
          }
          content="Copied to clipboard"
          inverted
          on="click"
          open={copiedToClipboard}
          position="bottom center"
          onOpen={onCopy}
        />
      </Copy>
      <div
        data-url="https://www.addthis.com/examples/share-buttons/inline/"
        data-title="TRIP TITLE"
        data-description="TRIP DESCRIPTION"
        data-media="https://www.addthis.com/examples/share-buttons/inline/"
      />
    </div>
  );
};

ShareData.propTypes = {
  title: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

export default ShareData;
