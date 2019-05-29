// NPM
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label as SemanticLabel, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// COMPONENTS
import Rating from '../Rating';
import PriceTag from '../Currency/PriceTag';
import Thumb from './components/Thumb';
import Col from '../layout/Col';
import PinIcon from 'shared_components/icons/PinIcon';
import CssOnlyTruncate from 'shared_components/CssOnlyTruncate';
import { translate } from 'shared_components/I18nText';

// ACTIONS/CONFIG

// STYLES
import { Cart } from './styles';
import { cardConfig } from 'libs/config';

const ContentWrap = styled.div`
  padding: 20px;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled.h3`
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 0;
  height: ${cardConfig.titleHeight};
  color: #313131;

  a {
    color: inherit;
  }
`;

const Label = styled.span`
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: #6e7885;
`;

const Location = styled.span`
  color: #6e7885;
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
  height: 44px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
    top: 3px;
  }

  p {
    width: 100%;
    font-size: 14px;
    font-weight: 300;
  }
`;

const SemanticLabelFixed = styled(SemanticLabel)`
  position: absolute;
  top: 10px;
  z-index: 10;
  right: 4px;

  a {
    opacity: 1 !important;
  }
`;

const RelativeCard = styled(Cart)`
  position: relative;
  box-shadow: 0 2px 10px 0 rgba(141, 141, 141, 0.22);
  transition: 0.15s all linear;

  &:hover {
    box-shadow: 0 5px 25px 0 rgba(141, 141, 141, 0.22);
    transform: translateY(-4px);
  }
`;

const stopEventPropogation = e => e.stopPropagation();

const wrapInRopstenLink = (text, reservation) => (
  <a
    href={`https://ropsten.etherscan.io/tx/${reservation.transactionHash}`}
    target="_blank"
    onClick={stopEventPropogation}
  >
    {text}
  </a>
);

function getSmartContractBookingStatus(reservation) {
  if (!reservation) return null;
  const { transactionHash, transactionStatus } = reservation;
  if (transactionHash != null) {
    if (transactionStatus === 1) {
      return wrapInRopstenLink(
        <SemanticLabelFixed color="green">
          Confirmed <Icon name="external" />
        </SemanticLabelFixed>,
        reservation,
      );
    }
    if (transactionStatus === 0) {
      return wrapInRopstenLink(
        <SemanticLabelFixed color="red">
          Unconfirmed <Icon name="external" />
        </SemanticLabelFixed>,
        reservation,
      );
    }
    if (!transactionStatus) {
      return wrapInRopstenLink(
        <SemanticLabelFixed color="blue">
          Processing <Icon name="external" />
        </SemanticLabelFixed>,
        reservation,
      );
    }
  }
  return <SemanticLabelFixed color="green">Confirmed</SemanticLabelFixed>;
}

export default class LocationCart extends Component {
  renderCard = () => {
    const smartContractBookingStatus = getSmartContractBookingStatus(this.props.item.reservation);
    return (
      <RelativeCard withShadow={this.props.withShadow} column>
        {smartContractBookingStatus && smartContractBookingStatus}
        <Thumb url={this.props.item.image} />
        <ContentWrap>
          <Title>
            <CssOnlyTruncate>{this.props.item.title}</CssOnlyTruncate>
          </Title>
          <Location>
            <PinIcon />
            <p>
              <CssOnlyTruncate>{this.props.item.location}</CssOnlyTruncate>
            </p>
          </Location>
          <Rating
            marginBottom="10px"
            rating={this.props.item.ratings.average}
            count={this.props.item.ratings.count}
          />
          <Label>Starting from</Label>
          <PriceTag price={this.props.item.price} />
        </ContentWrap>
      </RelativeCard>
    );
  };

  render() {
    const { href } = this.props;
    const card = this.renderCard();
    const cartWithLink = href ? (
      <Link title={(this.props.item && translate(this.props.item.title)) || ''} to={href}>
        {card}
      </Link>
    ) : (
      card
    );
    return (
      <Col>
        <div>{cartWithLink}</div>
      </Col>
    );
  }
}

// Props Validation
LocationCart.propTypes = {
  item: PropTypes.object,
};
