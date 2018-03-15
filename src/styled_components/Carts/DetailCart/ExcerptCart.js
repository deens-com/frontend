// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS
import Price from './components/Price';
import Button from '../../Button';
import Row from '../../layout/Row';
import Col from '../../layout/Col';
import Category from './components/Category';
import Description from './components/Description';

// ACTIONS/CONFIG
import theme from '../../../config/theme';
import { media } from '../../../libs/styled';

// STYLES
import { Thumb, ContentWrap } from '../styles';

const LeftCol = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;

  ${media.minSmall} {
    width: ${props => props.smWidth || '80%'};
    text-align: ${props => props.align || 'left'};
  }

  ${media.minMedium} {
    width: ${props => props.mdWidth || '80%'};
  }
`;

const RightCol = styled.div`
  width: 100%;

  ${media.minSmall} {
    width: ${props => props.smWidth || '20%'};
    text-align: ${props => props.align || 'left'};
  }

  ${media.minMedium} {
    width: ${props => props.mdWidth || '20%'};
  }
`;

const Detail = styled.span`
  display: inline-block;
`;

const Row2 = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: baseline;
`;

// MODULE
export default function Exceprt({ data, toggleExpansion }) {
  return (
    <ContentWrap>
      <Row noMargin>
        <LeftCol>
          <Category category={data.category} />
        </LeftCol>
        <RightCol align="right">
          <Price price={data.price} currency={data.currency} />
        </RightCol>
      </Row>
      <Row2>
        <LeftCol>
          <Description description={data.description} type="inline-block" />
          <Detail>{data.time}</Detail>
        </LeftCol>
        <RightCol align="right">
          <Button
            type="button"
            onClick={toggleExpansion}
            text="More info"
            size="text"
            theme={{ ...theme.button.textGreen }}
          />
        </RightCol>
      </Row2>
    </ContentWrap>
  );
}

// Props Validation
Exceprt.propTypes = {};
