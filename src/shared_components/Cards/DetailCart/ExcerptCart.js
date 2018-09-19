// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// COMPONENTS
import Button from '../../Button';
import Tag from './components/Tag';
import I18nText from 'shared_components/I18nText';
import NewPriceTag from 'shared_components/Currency/NewPriceTag';
import Category from './components/Category';
import CardDescription from './components/Description';
import Detail from './components/Detail';

import { padStart } from '../../../libs/Utils';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';

// STYLES
import { ContentWrap } from '../styles';

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
export default function ExcerptCart({ data: service, toggleExpansion, hideMoreInfo, isOwner }) {
  const { startTime, endTime } = service.periods[0];
  return (
    <CartContentWrap>
      <CartRow>
        <LeftCol>
          <Category category={service.categories[0]} />
          <Link to={`/services/${service._id}`}>
            <CardDescription type="inline-block">
              <I18nText data={service.title} />
            </CardDescription>
          </Link>
          {startTime && endTime ? (
            <Detail
              inline
              icon="clock"
              text={`${padStart(startTime, 2)}:00 - ${padStart(endTime, 2)}:00`}
              showEdit={isOwner}
            />
          ) : null}
        </LeftCol>
        <RightCol>
          <NewPriceTag basePrice={service.basePrice} baseCurrency={service.baseCurrency} />
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
      {service.availability === true ? <Tag text="Available" backgroundColor="#4CAF50" /> : null}
      {service.availability === false ? <Tag text="Unavailable" backgroundColor="#f44336" /> : null}
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
