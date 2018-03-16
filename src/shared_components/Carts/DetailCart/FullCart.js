// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import PriceTag from './components/Price';
import Button from '../../Button';
import Row from '../../layout/Row';
import Col from '../../layout/Col';
import Detail from './components/Detail';
import Category from './components/Category';
import Description from './components/Description';

// ACTIONS/CONFIG
import theme from '../../../config/theme';
import { media } from '../../../libs/styled';

// STYLES
import { LeftCol, RightCol } from './styles';
import { Thumb, ContentWrap } from '../styles';

const DeleteButton = styled(Button)``;

const ThumbCol = styled.div`
  flex-grow: 1;
  padding: 0;
  flex-basis: 100%;
  max-width: 100%;

  ${media.minSmall} {
    flex-basis: 250px;
    max-width: 250px;
  }

  & > div {
    padding-top: 50%;

    ${media.minSmall} {
      padding: 0;
      height: 100%;
    }
  }
`;

const ContentCol = styled.div`
  flex-grow: 1;
  padding: 25px 0 25px 25px;
`;

const ActionCol = styled.div`
  flex-basis: 100%;
  max-width: 100%;
  padding: 25px 25px 25px 0;

  ${media.minSmall} {
    flex-basis: 150px;
    max-width: 200px;
  }
`;

const HeaderRow = styled.div`
  margin-bottom: 25px;
`;

const ContentRow = styled.div`
  // & > div:first-child {
  //   flex-basis: 75%;
  //   max-width: 100%;
  // }

  // & > div:last-child {
  //   flex-basis: 90px;
  //   max-width: 90px;
  //   text-align: right;
  //   display: flex;
  //   justify-content: space-between;
  //   flex-direction: column;
  // }
`;

// MODULE
export default function FullCart({ data, toggleExpansion }) {
  return (
    <Row noMargin>
      <ThumbCol>
        <Thumb url={data.img} />
      </ThumbCol>
      <ContentCol>
        <HeaderRow>
          <Category category={data.category} />
          <Description description={data.description} />
        </HeaderRow>
        <ContentRow>
          <Detail icon="clock" text={data.time} />
          <Detail icon="pin" text={data.address} />
          <Detail icon="phone" text={data.phone} />
        </ContentRow>
      </ContentCol>
      <ActionCol>
        <DeleteButton
          type="button"
          onClick={ev => {
            alert('Deleting');
          }}
        >
          delete
        </DeleteButton>
        <PriceTag price={data.price} currency={data.currency} isExpanded />
        <Button
          type="button"
          onClick={toggleExpansion}
          text="Less info"
          size="text"
          align="left"
          width="auto"
          theme={{ ...theme.button.textGreen }}
        />
      </ActionCol>
    </Row>
  );
}

// Props Validation
FullCart.propTypes = {};
