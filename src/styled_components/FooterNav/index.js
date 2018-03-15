// NPM
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import styled from 'styled-components';

// COMPONENTS
import Row from '../layout/Row';
import Col from '../layout/Col';

// ACTIONS/CONFIG
import { footer } from '../../data/footer';
import { media } from '../../libs/styled';

// STYLES
const Wrapper = styled.div`
  margin-bottom: 25px;
  ${media.minMedium} {
    margin-bottom: 0;
  }
`;
const Title = styled.h4`
  margin-bottom: 15px;
`;
const List = styled.ul`
  list-style: none;

  li {
    margin-bottom: 3px;
    font-size: 14px;
    line-height: 1.5;
  }
`;

// MODULE
export default function HomeFooter({}) {
  return (
    <Row marginBottom="50px">
      {footer.map(col => (
        <Col key={col.title} xsBasis="100%" smBasis="50%" mdBasis="25%">
          <Wrapper>
            <Title>{col.title}</Title>
            <List>
              {col.nav.map(link => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </List>
          </Wrapper>
        </Col>
      ))}
    </Row>
  );
}

// Props Validation
HomeFooter.propTypes = {};
