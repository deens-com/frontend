// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// COMPONENTS
import Price from './components/Price';
import Button from '../../Button';
import Category from './components/Category';
import CardDescription from './components/Description';
import Detail from './components/Detail';

import { padStart } from '../../../libs/Utils';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

// STYLES
import { ContentWrap } from '../styles';
import Tag from './components/Tag';

const CartRow = styled.div`
  ${media.minSmall} {
    display: flex;
  }
`;

const CartContentWrap = styled(ContentWrap)`
  position: relative;
`;

const LeftCol = styled.div`
  display: inline-block;
  width: 100%;
  margin-bottom: 15px;

  // COMMENT: this is for the detial item
  & > div {
    position: relative;
    top: 2px;
  }

  ${media.minSmall} {
    width: 75%;
    margin-bottom: 0;
  }
`;

const RightCol = styled.div`
  display: inline-block;
  padding-top: 15px;
  border-top: 1px solid #eee;
  width: 100%;

  ${media.minSmall} {
    border-top: none;
    width: 25%;
    text-align: right;
    padding-top: 0;
  }

  ${media.minMedium} {
    // padding: 25px;
  }
`;

// MODULE
export default function ExcerptCart({ data, toggleExpansion, hideMoreInfo, isOwner }) {
  return (
    <CartContentWrap>
      <CartRow>
        <LeftCol>
          <Category category={data.type} />
          <Link to={`/services/${data.objectId}`}>
            <CardDescription description={data.name} type="inline-block" />
          </Link>
          <Detail
            inline
            icon="clock"
            text={`${padStart(data.openingTime, 2)}:00 - ${padStart(data.closingTime, 2)}:00`}
            showEdit={isOwner}
          />
        </LeftCol>
        <RightCol>
          <Price price={data.pricePerSession} currency={data.currency} />
          {!hideMoreInfo && (
            <Button
              type="button"
              onClick={toggleExpansion}
              text="More info"
              size="text"
              iconAfter="arrowDown"
              theme="textGreen"
            />
          )}
        </RightCol>
      </CartRow>
      {data.availability === true ? <Tag text="Available" backgroundColor="#4CAF50" /> : null}
      {data.availability === false ? <Tag text="Unavailable" backgroundColor="#f44336" /> : null}
    </CartContentWrap>
  );
}

// Props Validation
ExcerptCart.propTypes = {
  hideMoreInfo: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,
};

ExcerptCart.defaultProps = {
  hideMoreInfo: false,
};
