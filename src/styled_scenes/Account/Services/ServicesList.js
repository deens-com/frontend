import React from 'react';
import { Link } from "react-router-dom";
import uuid from 'uuid/v1';
import { Divider, Label } from 'semantic-ui-react';
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
          <PriceTag price={item.pricePerSession} />
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
