import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UserAvatar from 'shared_components/UserAvatar';
import { padStart, extractPrice, extractPricePer, PRICE_PER_SESSION } from 'libs/Utils';
import PriceTag from 'shared_components/Currency/PriceTag';
import Rating from 'shared_components/Rating';
import { Link } from 'react-router-dom';
import searchActions from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;

  tr {
    height: auto;
    &:first-child {
      td {
        padding-top: 0;
      }
    }
    td {
      padding: 13px 0;
      font-size: 13px;
    }
  }

  tr:not(:last-child) {
    border-bottom: 1pt solid #e2e2e2;
  }
`;

const Row = styled.tr`
  height: 65px;
`;

const ServiceInformation = ({ service, updateSearchParams }) => {
  if (!service || !service.ratings) return null;
  return (
    <Table>
      <tbody>
        <Row>
          <td>Host</td>
          <td>
            <UserAvatar user={service.owner} />
          </td>
        </Row>
        <Row>
          <td>Working Hours</td>
          <td>
            {' '}
            {`${padStart(service.openingTime, 2)}:00 - ${padStart(service.closingTime, 2)}:00`}{' '}
          </td>
        </Row>
        <Row>
          <td>
            {extractPricePer(service.basePrice) === PRICE_PER_SESSION
              ? service.type !== 'Accommodation'
                ? 'Price Per Session'
                : 'Price Per Night'
              : 'Price Per Adult'}
          </td>
          <td>
            <PriceTag price={extractPrice(service.basePrice)} />
          </td>
        </Row>
        <Row>
          <td>Location</td>
          <td>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() =>
                updateSearchParams({
                  address: service.location,
                  latitude: service.geo.lat,
                  longitude: service.geo.lng,
                })
              }
            >
              {service.type === 'Food'
                ? service.originalLocation.formattedAddress
                : service.location}
            </span>
          </td>
        </Row>
        <Row>
          <td>Rating</td>
          <td>
            <Rating rating={service.ratings.average} count={service.ratings.count} />
          </td>
        </Row>
      </tbody>
    </Table>
  );
};

ServiceInformation.propTypes = {
  service: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(searchActions, dispatch);
};

export default connect(
  null,
  mapDispatchToProps,
)(ServiceInformation);
