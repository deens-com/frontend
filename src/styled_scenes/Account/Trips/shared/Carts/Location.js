// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Truncate from 'react-truncate';
import * as actions from './../../../../../scenes/service-upsert/actions';
import { Popup } from 'semantic-ui-react';

// COMPONENTS
import Rating from 'shared_components/Rating';
import Thumb from './components/Thumb';
import Col from 'shared_components/layout/Col';
import { PinIcon } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import CityCountry from 'shared_components/CityCountry';

// ACTIONS/CONFIG

// STYLES
import { Cart } from './styles';
import { cardConfig } from 'libs/config';
import { getLargeImageFromMedia } from 'libs/Utils';
import NewPriceTag from 'shared_components/Currency/NewPriceTag';

const ContentWrap = styled.div`
  padding: 20px;
`;

// How did we come up with height: 104px?
// the max number of lines Title can render is 4
// rendered a title that long and saw how many pixels it takes 😜
const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
  height: ${cardConfig.titleHeight};

  a {
    color: inherit;
  }
`;

const Label = styled.span`
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: #6e7885;
`;

const Location = styled.span`
  color: #6e7885;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  height: 44px;

  svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 2px;
    fill: #d3d7dc;
    position: relative;
    left: -3px;
  }

  p {
    width: 100%;
  }
`;

const RelativeCard = styled(Cart)`
  position: relative;
`;

const ImageGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
`;

const ImageItem = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;
  grid-column-end: span 2;
`;

// MODULE
class ServiceLocationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      truncated: false,
    };
  }

  handleTruncate = truncated => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  };

  wrapWithLink = element => {
    const { item } = this.props;
    return <Link to={`/services/${item._id}`}>{element}</Link>;
  };

  render() {
    const { item, withShadow, mdBasis, smBasis, xsBasis } = this.props;
    const card = (
      <Col xsBasis={xsBasis} mdBasis={smBasis} smBasis={mdBasis}>
        <RelativeCard withShadow={withShadow} column>
          <ImageGridContainer>
            <ImageItem>
              {this.wrapWithLink(<Thumb url={getLargeImageFromMedia(item.media)} />)}
            </ImageItem>
          </ImageGridContainer>
          <ContentWrap>
            {this.wrapWithLink(
              <div>
                <Title>
                  <Truncate onTruncate={this.handleTruncate} lines={cardConfig.titleLines}>
                    <I18nText data={item.title} />
                  </Truncate>
                </Title>

                {item.location && (
                  <Location>
                    <PinIcon />
                    <p>
                      <Truncate lines={cardConfig.locationLines}>
                        <CityCountry location={item.location} />
                      </Truncate>
                    </p>
                  </Location>
                )}
                <Rating marginBottom="10px" rating={item.rating} count={item.reviewCount} />
                <Label>Starting from</Label>
                <NewPriceTag basePrice={item.basePrice} baseCurrency={item.baseCurrency} />
              </div>,
            )}
          </ContentWrap>
        </RelativeCard>
      </Col>
    );
    if (this.state.truncated) return <Popup trigger={card} content={this.props.item.title} />;
    return card;
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ServiceLocationCard));
