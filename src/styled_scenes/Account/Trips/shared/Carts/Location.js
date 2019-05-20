// NPM
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';

// COMPONENTS
import Rating from 'shared_components/Rating';
import Thumb from './components/Thumb';
import Col from 'shared_components/layout/Col';
import { PinIcon } from 'shared_components/icons';
import I18nText from 'shared_components/I18nText';
import CityCountry from 'shared_components/CityCountry';
import CssOnlyTruncate from 'shared_components/CssOnlyTruncate';

// ACTIONS/CONFIG

// STYLES
import { Cart } from './styles';
import { cardConfig } from 'libs/config';
import { generateServiceSlug } from 'libs/Utils';
import { getImageUrlFromMedia } from 'libs/media';
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
class ServiceLocationCard extends React.PureComponent {
  wrapWithLink = element => {
    const { item } = this.props;
    return <Link to={`/services/${generateServiceSlug(item)}`}>{element}</Link>;
  };

  render() {
    const { item, withShadow, mdBasis, smBasis, xsBasis } = this.props;
    const card = (
      <Col xsBasis={xsBasis} mdBasis={smBasis} smBasis={mdBasis}>
        <RelativeCard withShadow={withShadow} column>
          <ImageGridContainer>
            <ImageItem>
              {this.wrapWithLink(<Thumb url={getImageUrlFromMedia(item.media, 'large')} />)}
            </ImageItem>
          </ImageGridContainer>
          <ContentWrap>
            {this.wrapWithLink(
              <div>
                <Title>
                  <CssOnlyTruncate>
                    <I18nText data={item.title} />
                  </CssOnlyTruncate>
                </Title>

                {item.location && (
                  <Location>
                    <PinIcon />
                    <p>
                      <CssOnlyTruncate>
                        <CityCountry location={item.location} />
                      </CssOnlyTruncate>
                    </p>
                  </Location>
                )}
                <Rating
                  marginBottom="10px"
                  rating={item.ratings.average}
                  count={item.ratings.count}
                />
                <Label>Starting from</Label>
                <NewPriceTag basePrice={item.totalPrice} baseCurrency={item.baseCurrency} />
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

export default ServiceLocationCard;
