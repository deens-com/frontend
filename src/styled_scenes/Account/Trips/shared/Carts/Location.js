// NPM
import React, {Component} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Label as SemanticLabel, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import * as actions from './../../../../../scenes/service-upsert/actions';

// COMPONENTS
import Rating from './../../../../../shared_components/Rating';
import PriceTag from './../../../../../shared_components/Currency/PriceTag';
import Thumb from './components/Thumb';
import Col from './../../../../../shared_components/layout/Col';
import { PinIcon } from './../../../../../shared_components/icons';

// ACTIONS/CONFIG

// STYLES
import { Cart } from './styles';

const ContentWrap = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;

  a {
    color: inherit;
  }
`;

const Excerpt = styled.p`
  color: #6e7885;
  line-height: 1.5;
  margin-bottom: 15px;
  height: 48px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Label = styled.span`
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: #6e7885;
  margin-bottom: 5px;
`;

const Location = styled.span`
  color: #6e7885;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
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

const getSmartContractBookingStatus = (props) => {
  if (!props.item.reservation) return null;
  const { transactionHash, transactionStatus } = props.item.reservation;
  const values = {pricePerSession: props.item.pricePerSession, slots: props.item.slots};
  if (transactionHash != null) {
    if (transactionStatus === 1) {
      return wrapInRopstenLink(
        <SemanticLabelFixed onClick={props.redeployContract} color="green">
          Confirmed <Icon name="external" />
        </SemanticLabelFixed>,
        props.item.reservation
      );
    }
    if (transactionStatus === 0) {
      return (
        <div>
          <a
            href={`https://ropsten.etherscan.io/tx/${props.item.reservation.transactionHash}`}
            target="_blank"
            onClick={stopEventPropogation}
          >
            <SemanticLabelFixed color="red">
              Failed <Icon name="external" />
            </SemanticLabelFixed>
          </a>
          <SemanticLabelFixed style={{top: "40px"}} onClick={() => props.redeployContract(values, props.item, props.history)} color="green">
            Re-deploy
          </SemanticLabelFixed>
        </div>
      );
    }
    if (!transactionStatus) {
      return wrapInRopstenLink(
        <SemanticLabelFixed color="blue">
          Pending <Icon name="external" />
        </SemanticLabelFixed>,
        props.item.reservation
      );
    }
  }
  return <SemanticLabelFixed color="green">Confirmed</SemanticLabelFixed>;
}

const cart = (props) => {
  return (
    <RelativeCard withShadow={props.withShadow} column>
      {getSmartContractBookingStatus(props) && getSmartContractBookingStatus(props)}
      <Thumb url={props.item.image} />
      <ContentWrap>
        <Title>
          <p>{props.item.title}</p>
        </Title>
        <Excerpt>{props.item.excerpt}</Excerpt>

        {props.item.type && (
          <Location>
            <PinIcon />
            {props.item.location}
          </Location>
        )}
        <Rating marginBottom="25px" rating={props.item.rating} count={props.item.reviewCount} />
        <Label>Starting from</Label>
        <PriceTag price={props.item.price} />
      </ContentWrap>
    </RelativeCard>
  )
};

// MODULE
class ServiceLocationCard extends Component {
  render(){
    return (
      <Col xsBasis={this.props.xsBasis} mdBasis={this.props.mdBasis} smBasis={this.props.smBasis}>
        <div>
          {this.props.href && <Link to={this.props.href}>{cart(this.props)}</Link>}
          {!this.props.href && cart(this.props)}
        </div>
      </Col>
    );
  }
}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ServiceLocationCard));
