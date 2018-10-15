import React from 'react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
import { Loader, Dimmer } from 'semantic-ui-react';
import styled from 'styled-components';

const PageContent = styled.div`
  max-width: 825px;
  margin: auto 20px;
  ${media.minSmall} {
    margin: auto;
    width: 100%;
  }
`;

const BackButton = styled(Link)`
  position: relative;
  left: -250px;
  top: 20px;
  font-size: 14px;
  color: #38d39f;
`;

export default class Share extends React.Component {
  render() {
    return (
      <PageContent>
        <BackButton to={`/trips/organize/${this.props.tripId}`} replace>
          Back to customization
        </BackButton>
      </PageContent>
    );
  }
}
