// NPM
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";

// COMPONENTS
import Row from "../../../../shared_components/layout/Row";
import Col from "../../../../shared_components/layout/Col";

// ACTIONS/CONFIG
import { footer } from "../../../../data/footer";
import { media } from "../../../../libs/styled";

// STYLES
const Wrap = styled.div`
  margin: 0 0 50px;
  display: flex;
  flex-wrap: wrap;
`;
const NavWrap = styled.div`
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
    <Wrap flex margin="0 0 50px">
      {footer.map(col => (
        <Col key={col.title} xsBasis="100%" smBasis="50%" mdBasis="25%">
          <NavWrap>
            <Title>{col.title}</Title>
            <List>
              {col.nav.map(link => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </List>
          </NavWrap>
        </Col>
      ))}
    </Wrap>
  );
}

// Props Validation
HomeFooter.propTypes = {};
