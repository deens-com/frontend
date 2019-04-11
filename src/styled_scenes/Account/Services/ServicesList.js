import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Label, Button, Icon, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import Rating from 'shared_components/Rating';
import * as SmartContractStatus from 'shared_components/SmartContract/Status';
import { media } from 'libs/styled';
import { generateServiceSlug } from 'libs/Utils';
import { getImageUrlFromMedia } from 'libs/media';
import PriceTag from '../../../shared_components/Currency/PriceTag';
import Thumb from '../../../shared_components/Carts/components/Thumb';
import { Cart } from '../../../shared_components/Carts/styles';
import I18nText from '../../../shared_components/I18nText';

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

const LoaderContainer = styled.div`
  margin-top: 50px;
`;

const ContentWrap = styled.div`
  padding: 15px;

  ${media.minSmall} {
    padding: 20px;
  }

  ${media.minMedium} {
    padding: 25px;
  }
`;

const ServiceItem = item => {
  const isActivated = item.status === 'active';

  const showContractStatus = item.contractAddress != null;
  const image = getImageUrlFromMedia(item, 'thumbnail');
  return (
    <Cart column>
      {showContractStatus && (
        <SmartContractStatus.Wrapper status={item.contractStatus} hash={item.hash} />
      )}
      {image && (
        <Link to={'/services/' + generateServiceSlug(item)} key={item.objectId}>
          <Thumb url={image} />
        </Link>
      )}

      <ContentWrap>
        <Link to={'/services/' + generateServiceSlug(item)} key={item.objectId}>
          <Title>{item.name}</Title>

          <Rating marginBottom="25px" rating={item.ratings.average} count={item.ratings.count} />

          <Label>
            <I18nText data={item.categories[0].names} />
          </Label>

          <br />
          <br />
          <PriceTitle>Starting from</PriceTitle>
          <PriceTag price={item.price} />
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
            data-status="inactive"
            data-object-id={item.objectId}
          >
            Disable Service
          </Button>
        ) : (
          <Button
            color="green"
            onClick={item.update_user_service_status}
            data-status="active"
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
  if (props.isLoading) {
    return (
      <LoaderContainer>
        <Loader active inline="centered" size="big" />
      </LoaderContainer>
    );
  }
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
