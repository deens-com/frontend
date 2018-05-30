import React from 'react';
import { Link } from "react-router-dom";
import uuid from 'uuid/v1';
import { Divider, Label, Button, Icon } from 'semantic-ui-react';
import styled from "styled-components";
import Rating from "../../../shared_components/Rating";
import PriceTag from "../../../shared_components/Currency/PriceTag";
import Thumb from "../../../shared_components/Carts/components/Thumb";
import { Cart, ContentWrap } from "../../../shared_components/Carts/styles";

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
`;

const PriceTitle = styled.span`
  color: #6e7885;
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const ServiceItem = (item) => {
  return (
    <Link to={ "/services/" + item.objectId} key={item.objectId}>
      <Cart column>
        <Thumb
          url={item.mainPicture.url}
        />

        <ContentWrap>
          <Title>
            {item.name}
          </Title>

          <Rating
            marginBottom="25px"
            rating={item.rating}
            count={item.reviewCount}
          />

          <Label>{item.type}</Label>
          <br /><br />
          <PriceTitle>Starting from</PriceTitle>
          <PriceTag price={item.pricePerSession} />
          <br />
          <Button icon color="teal" labelPosition='right'>
            <Icon name='pencil' />
            Edit
          </Button>
        </ContentWrap>
      </Cart>
    </Link>
  )
};

const ServicesList = props => {
  return (
    <section>
      <br /><br />
      <Divider/>
      {props.user_services.map((item, index) => (
        <Wrap key={uuid()}>
            <ServiceItem {...item}/>
        </Wrap>
      ))}
      {props.user_services.length === 0 &&
        <EmptyServicesText>
          You don't have any services associated with your account yet.
        </EmptyServicesText>
      }
    </section>
  );
};

export default ServicesList;
