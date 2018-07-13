// NPM
import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// COMPONENTS
import Row from "../../../shared_components/layout/Row";
import TripCart from "../../../shared_components/Carts/Trip";
import ReactPaginate from 'react-paginate';
import { media } from '../../../libs/styled';
import { Loader } from 'semantic-ui-react'

// STYLES
const Wrap = styled.div`
  padding: 25px;
`;

const PaginationWrap = styled.div`
  text-align: center;

  ul {
    display: inline-block;
    list-style-type: none;

    li {
      float: left;
      margin: 0;
      padding: 0;

      a {
        display: block;
        padding: 5px 12px;
        margin: 0 5px;
        border: 1px solid grey;
        border-radius: 4px;
        cursor: pointer;

        &:focus {
          outline: none;
        }
      }

      &.selected {
        a {
          border: 1px solid #4fb798;
          color: #4fb798;
        }
      }

      &.disabled {
        a {
          visibility: hidden;
        }
      }
    }
  }
`;

const ResultItem = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 12%;
  ${media.minSmall}{
    margin-left: 0px;
  }
`;

const Badge = styled.div`
  position: absolute;
  z-index: 10;
  font-size: 10px;
  font-weight: bold;
  top: 20px;
  right: 20px;
  background: #4183c4;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
`;

const LoaderWithMargin = styled.section`
  margin-top: 40px;
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

  loadData = (item) => {
    let data = [];
    let skip = 0;
    let selected = 0;

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
        <Row>
          {
            this.state.filteredData.length === 0 &&
            <section>
              <h4 style={{textAlign: 'center', color: 'grey'}}>There are no search results for given search criteria.</h4>
              <br/>
            </section>
          }
          { this.props.isLoadingResults
              ?
                <LoaderWithMargin>
                  <Loader active inline='centered' size='massive'>Loading Results</Loader>
                </LoaderWithMargin>
              :
                this.state.filteredData.map((result, i) => (
                  <ResultItem key={result.objectId}>
                  <Link to={(result.type ? '/services/' : '/trips/') + result.objectId}>
                  {result.contractAddress &&
                    <Badge>Decentralized</Badge>
                  }
                  <TripCart
                  key={result.label}
                  withTooltip
                  withShadow
                  item={result}
                  />
                  </Link>
                  </ResultItem>
                ))
          }
        </Row>
        <Row>
          <PaginationWrap>
            {
              (!this.props.isLoadingResults && this.state.filteredData.length)
                ?
              <ReactPaginate pageCount={Math.ceil(this.state.totalItems / limit_per_page)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={this.loadData} />
                :
              null
            }
          </PaginationWrap>
        </Row>
      </Wrap>
    );
  }
}
