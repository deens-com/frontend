// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// COMPONENTS
import PriceTag from './components/Price';
import Button from '../../Button';
import Detail from './components/Detail';
import Category from './components/Category';
import Description from './components/Description';
import Thumb from '../components/Thumb';
import { TrashIcon } from './components/icons';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';
import Tag from './components/Tag';

const Wrap = styled.div`
  ${media.minSmall} {
    display: flex;
  }
  position: relative;
`;

const DeleteButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  color: #d3d7dc;

  ${media.minSmall} {
    position: static;
    margin: 10px 0;
  }

  & > div {
    width: 25px;
  }

  svg {
    font-size: 24px !important;
  }
`;

const LeftCol = styled.div`
  flex-grow: 1;
  padding: 0;
  flex-basis: 100%;
  max-width: 100%;

  ${media.minSmall} {
    flex-basis: 200px;
    max-width: 200px;
  }

  & > div {
    ${media.minSmall} {
      padding: 0;
      height: 100%;
    }
  }
`;

const ContentCol = styled.div`
  width: 100%;

  ${media.minSmall} {
    display: flex;
  }
`;

const CenterCol = styled.div`
  padding: 15px;

  ${media.minSmall} {
    flex-basis: 70%;
    min-width: 70%;
    padding: 20px;
  }

  ${media.minMedium} {
    padding: 25px;
  }
`;

const RightCol = styled.div`
  margin: 0 15px 15px 15px;
  padding-top: 15px;
  border-top: 1px solid #efeff0;
  position: relative;

  ${media.minSmall} {
    border-top: none;
    flex-basis: 30%;
    min-width: 30%;
    margin: 0;
    padding: 20px;
    text-align: right;
    display: flex;
    flex-direction: column;

    & > div:last-child {
      margin-top: auto;
      margin-bottom: 10px;
      padding-top: 10px;
    }
  }

  ${media.minMedium} {
    padding: 25px;
    flex-basis: 150px;
    max-width: 200px;
  }
`;

const HeaderRow = styled.div`
  margin-bottom: 10px;
`;

const ContentRow = styled.div``;

// MODULE
export default function FullCart({ data, toggleExpansion, onDeleteClick }) {
  return (
    <Wrap>
      <LeftCol>
        <Thumb url={data.mainPicture.url} tripCount={data.partOf} withTooltip />
      </LeftCol>
      <ContentCol>
        <CenterCol>
          <HeaderRow>
            <Category category={data.type} />
            <Link to={`/services/${data.objectId}`}>
              <Description description={data.description} />
            </Link>
          </HeaderRow>
          <ContentRow>
            <Detail block icon="clock" text={data.openingTime} />
            <Detail block icon="pin" text={data.city + ', ' + data.country} />
            <Detail block icon="phone" text={data.phone} />
          </ContentRow>
        </CenterCol>
        <RightCol>
          <DeleteButton>
            <Button theme="icon" size="text" type="button" onClick={onDeleteClick}>
              <TrashIcon />
            </Button>
          </DeleteButton>
          <PriceTag price={data.pricePerSession} currency={data.currency} isExpanded />
          <Button
            type="button"
            onClick={toggleExpansion}
            text="Less info"
            size="text"
            align="left"
            width="auto"
            iconAfter="arrowUp"
            theme="textGreen"
          />
        </RightCol>
      </ContentCol>
      {data.availability === true ? <Tag text="Available" backgroundColor="#4CAF50" /> : null}
      {data.availability === false ? <Tag text="Unavailable" backgroundColor="#f44336" /> : null}
    </Wrap>
  );
}

// Props Validation
FullCart.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
};
