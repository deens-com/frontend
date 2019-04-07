import React from 'react';
import styled from 'styled-components';
import { media } from 'libs/styled';
import axios from 'libs/axios';
import { Segment, Loader } from 'semantic-ui-react';
import Input from 'shared_components/StyledInput';
import BuyButton from './BuyButton';
import { Link } from 'react-router-dom';
import { plsValue, usdToPls } from 'libs/currency';
import moment from 'moment';

const preIcoBonus = 20; // in %

const Wrapper = styled.div`
  max-width: 650px;
  margin: 30px auto;
  text-align: center;
`;

const SegmentContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${media.minSmall} {
    padding: 0 132px;
  }
`;

const SegmentTitle = styled.div`
  font-size: 18px;
  text-align: center;
`;

const PLSNumber = styled.div`
  background-color: #097da8;
  color: white;
  display: inline-block;
  border-radius: 5px;
  padding: 11px 43px;
  margin: 18px auto 0;
`;

const HowMuch = styled.p`
  margin-top: 30px;
  text-align: left;
`;

const Divider = styled.div`
  border-bottom: 1px solid #e0e0e0;
  margin-top: 10px;
`;

const Table = styled.div`
  margin-top: 14px;
  text-align: left;
  margin-bottom: 30px;
`;

const Row = styled.div`
  display: flex;
`;

const FirstCol = styled.div`
  flex-grow: 1;
`;

const SecondCol = styled.div`
  flex-shrink: 1;
`;

const SmartContractLink = styled(Link)`
  color: #097da8;
  text-decoration: underline;
`;

const USDInput = styled.span`
  color: #c1c1c1;
  font-weight: bold;
`;

const HistoryTable = styled.table`
  margin: auto;
  border-spacing: 0;

  tr {
    td {
      padding: 5px 20px;
      border-top: 1px solid #e0e0e0;
    }
  }

  tr:nth-child(1) {
    font-weight: bold;
    td {
      border: none;
    }
  }
`;

const History = styled.div`
  padding: 20px;
`;

export default class BuyTokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      loadingHistory: true,
      errorHistory: false,
      dataHistory: null,
    };
    this.loadHistory();
  }

  loadHistory = async () => {
    try {
      const response = await axios.get('/payment/history/ico');

      this.setState({
        loadingHistory: false,
        dataHistory: response.data,
      });
    } catch (e) {
      this.setState({
        loadingHistory: false,
        errorHistory: true,
      });
    }
  };

  renderHistory() {
    if (this.state.errorHistory) {
      return 'There was an error loading the purchase history. Please refresh the page to try again.';
    }

    return (
      <React.Fragment>
        <h2 style={{ padding: 0 }}>Purchase History</h2>
        <HistoryTable>
          <tr>
            <td>Date</td>
            <td>Bought PLS</td>
          </tr>
          {this.state.dataHistory.map(data => {
            return (
              <tr key={data._id}>
                <td>{moment(data.createdAt).format('LLL')}</td>
                <td>{data.plsTokens.toFixed(2)}</td>
              </tr>
            );
          })}
        </HistoryTable>
      </React.Fragment>
    );
  }

  inputChange = event => {
    const value = Number(event.target.value);
    this.setState({ amount: value });
  };

  render() {
    const plsToBuy = usdToPls(this.state.amount);
    const bonus = (Number(plsToBuy) * preIcoBonus) / 100;
    const total = (Number(plsToBuy) + Number(bonus)).toFixed(2);
    return (
      <Wrapper>
        <SmartContractLink to="/token-sale/smart-contract">
          Contribute through smart contract
        </SmartContractLink>
        <Segment>
          <SegmentContent>
            <SegmentTitle>My PLS</SegmentTitle>
            <PLSNumber>{this.props.plsBalance || 0} PLS</PLSNumber>
          </SegmentContent>
        </Segment>
        <Segment>
          <SegmentContent>
            <SegmentTitle>Purchase Tokens</SegmentTitle>
            <HowMuch>How much would you like to contribute?</HowMuch>
            <Input
              leftContent={this.state.amount ? <USDInput>USD</USDInput> : null}
              type="number"
              min="1"
              step="any"
              onChange={this.inputChange}
              placeholder="Amount in USD"
            />
            <Table>
              <Divider />
              <Row>
                <FirstCol>Amount in PLS (1 PLS = ${plsValue})</FirstCol>
                <SecondCol>{plsToBuy.toFixed(2)}</SecondCol>
              </Row>
              <Divider />
              <Row>
                <FirstCol>(Pre-ICO) {preIcoBonus}% bonus in PLS</FirstCol>
                <SecondCol>{bonus.toFixed(2)}</SecondCol>
              </Row>
              <Divider />
              <Row>
                <FirstCol>Total amount in PLS</FirstCol>
                <SecondCol>≈ {total}</SecondCol>
              </Row>
            </Table>
            <BuyButton amount={this.state.amount} onSuccess={this.props.onTokenBought} />
          </SegmentContent>
        </Segment>
        <Segment>
          <History>
            <Loader active={this.state.loadingHistory} />
            {!this.state.loadingHistory && this.renderHistory()}
          </History>
        </Segment>
      </Wrapper>
    );
  }
}
