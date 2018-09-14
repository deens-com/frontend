import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Label, Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Rating from 'shared_components/Rating';
import * as SmartContractStatus from 'shared_components/SmartContract/Status';
import PriceTag from '../../../shared_components/Currency/PriceTag';
import Thumb from '../../../shared_components/Carts/components/Thumb';
import { Cart, ContentWrap } from '../../../shared_components/Carts/styles';
import i18n from './../../../libs/i18n';

const EmptyServicesText = styled.p`
  font-style: italic;
  color: #a3a9b2;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  a {
    color: inherit;
  }
`;

const Wrap = styled.div`
  display: inline-block;
  width: 240px;
  padding: 10px;
  position: relative;
  float: left;

  .status {
    position: absolute !important
    top: 0;
    right: 0;
    z-index: 1;
  }
`;

const PriceTitle = styled.span`
  color: #6e7885;
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const getItemType = type => {
  switch (type) {
    case 'place':
      return i18n.t('places.singular');
    case 'activity':
      return i18n.t('activities.singular');
    case 'food':
      return i18n.t('foods.singular');
    default:
      return '';
  }
};

const ServiceItem = item => {
  const isActivated = item.serviceStatus !== 'disabled';

  const showContractStatus = item.contractAddress != null;

  return (
    <Cart column>
      {showContractStatus && (
        <SmartContractStatus.Wrapper status={item.contractStatus} hash={item.hash} />
      )}
      {item.media &&
        item.media[0] && (
          <Link to={'/services/' + item.objectId} key={item.objectId}>
            <Thumb url={item.media[0]} />
          </Link>
        )}

      <ContentWrap>
        <Link to={'/services/' + item.objectId} key={item.objectId}>
          <Title>{item.name}</Title>

          <Rating marginBottom="25px" rating={item.rating} count={item.reviewCount} />

          <Label>{getItemType(item.type)}</Label>

          <br />
          <br />
          <PriceTitle>Starting from</PriceTitle>
          <PriceTag price={item.pricePerSession} />
          <br />
        </Link>
        <Button
          as={Link}
          to={'/services/edit/' + item.objectId}
          icon
          color="teal"
          labelPosition="right"
        >
          <Icon name="pencil" />
          Edit
        </Button>
        <br />
        <br />
        {isActivated ? (
          <Button
            color="red"
            onClick={item.update_user_service_status}
            data-status="disabled"
            data-object-id={item.objectId}
          >
            Disable Service
          </Button>
        ) : (
          <Button
            color="green"
            onClick={item.update_user_service_status}
            data-status="activated"
            data-object-id={item.objectId}
          >
            Activate Service
          </Button>
        )}
      </ContentWrap>
    </Cart>
  );
};

const ServicesList = props => {
  return (
    <section>
      <br />
      <br />
      <Divider />
      {props.user_services.map((item, index) => (
        <Wrap key={item.objectId}>
          <ServiceItem {...item} {...props} />
        </Wrap>
      ))}
      {props.user_services.length === 0 && (
        <EmptyServicesText>
          You don't have any services associated with your account yet.
        </EmptyServicesText>
      )}
    </section>
  );
};

export default ServicesList;
