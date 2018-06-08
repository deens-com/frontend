import React from 'react';
import { Link } from "react-router-dom";
import uuid from 'uuid/v1';
import { Divider, Label, Button, Icon } from 'semantic-ui-react';
import styled from "styled-components";
import Rating from "shared_components/Rating";
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
  position: relative;

  .status {
    position: absolute !important
    top: 0;
    right: 0;
  }
`;

const PriceTitle = styled.span`
  color: #6e7885;
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const contractStatusLabel = {
  pending: "Pending Verification",
  rejected: "Smart Contract Rejected",
  verified: "Smart Contract Verified"
}

const ContractStatusWrapper = (props) => {
  if (props.status === "verified"){
    return (
      <div>
      <Label color='green' className="status">
        {contractStatusLabel.verified}
     </Label>
     </div>
    )
  } else if (props.status === "rejected"){
    return (
      <div>
      <Label color='red' className="status">
       {contractStatusLabel.rejected}
     </Label>
     </div>
    )
  }

  return (
    <div>
    <Label as="a" color='teal' className="status">
     <Icon name='external' />{contractStatusLabel.pending}
   </Label>
   </div>
  )
}

const ServiceItem = (item) => {
  const isActivated = item.serviceStatus !== "disabled";

  const showContractStatus = item.contractAddress != null;

  return (
    <Cart column>
      {showContractStatus &&
        <ContractStatusWrapper status={item.contractStatus}/>
      }
      {item.mainPicture &&
        <Link to={ "/services/" + item.objectId} key={item.objectId}>
          <Thumb
            url={item.mainPicture.url}
          />
        </Link>
      }

      <ContentWrap>
        <Link to={ "/services/" + item.objectId} key={item.objectId}>
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
        </Link>
        <Button as={Link} to={ "/services/edit/" + item.objectId} icon color="teal" labelPosition='right'>
          <Icon name='pencil' />
          Edit
        </Button>
        <br />
        <br />
        {isActivated ?
          <Button color="red" onClick={item.update_user_service_status} data-status="disabled" data-object-id={item.objectId}>Disable Service</Button>
        :
          <Button color="green" onClick={item.update_user_service_status} data-status="activated" data-object-id={item.objectId}>Activate Service</Button>
        }
      </ContentWrap>
    </Cart>
  )
};

const ServicesList = props => {
  return (
    <section>
      <br /><br />
      <Divider/>
      {props.user_services.map((item, index) => (
        <Wrap key={uuid()}>
            <ServiceItem {...item} {...props}/>
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
