// NPM
import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import Row from "../../../shared_components/layout/Row";
import TripCart from "../../../shared_components/Carts/Trip";
import ReactPaginate from 'react-paginate';

// STYLES
const Wrap = styled.div`
  padding: 25px;
`;

const Header = styled.div`
  margin-bottom: 25px;

  h4 {
    font-size: 24px;
  }
`;

const PaginationWrap = styled.div`
  text-align: center;

  ul {
    display: inline-block;
    list-style-type: none;

    li {
      float: left;
      padding: 5px 10px;
      margin: 0 5px;
      border: 1px solid grey;
      border-radius: 4px;
      cursor: pointer;

      a {
        &:focus {
          outline: none;
        }
      }

      &.selected {
        border: 1px solid #4fb798;
        a {
          color: #4fb798;
        }
      }

      &.disabled {
        visibility: hidden;
      }
    }
  }
`;


const limit_per_page = 12;

// MODULE
export default class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filteredData: [],
      totalItems: 0
    }
  }

  componentWillReceiveProps() {
    this.loadData();
    this.setState({totalItems: this.props.data.length});
  }

  loadData(item) {
    let data = [];
    let skip = 0;
    let selected = 1;

    if (item) {
      selected = item.selected;
    }

    this.props.data.forEach((result, i) => {
      if (i < (selected * limit_per_page)) {
        skip++
        return;
      }

      if (i < (skip + limit_per_page)) {
        data.push(result);
      }
    });

    this.setState({filteredData: data});
  }

  render() {
    return (
      <Wrap>
        <Header>
          <h4>{this.props.service_type} for you</h4>
        </Header>
        <Row>
          {this.state.filteredData.map((result, i) => (
            <Link to={(result.type ? "/services/" : "/trips/") + result.objectId} key={result.objectId}>
              <TripCart
                key={result.label}
                withTooltip
                withShadow
                item={result}
              />
            </Link>
          ))}
        </Row>
        <Row>
          <PaginationWrap>
            <ReactPaginate pageCount={this.state.totalItems / limit_per_page}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           onPageChange={this.loadData.bind(this)} />
           </PaginationWrap>
        </Row>
      </Wrap>
    );
  }
}
