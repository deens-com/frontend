import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { Draggable } from 'react-beautiful-dnd';
import { types } from '../constants';
import { P, PSmallStrong, PXSmall } from 'libs/commonStyles';
import { lightText, primary, secondaryContrast, secondary } from 'libs/colors';
import { Drag } from 'shared_components/icons';
import Stars from 'shared_components/Rating/Stars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ServiceBox = styled.div`
  background: ${props => (props.img ? `url(${props.img})` : 'gray')};
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  width: 190px;
  height: 225px;
  position: relative;
  overflow: hidden;
`;

const ServiceOptions = styled.div`
  display: flex;
  height: 35px;
  border-radius: 5px 5px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 0;
  box-shadow: 1px 1px rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 8px;
  margin: auto;
`;

const ServiceData = styled.div`
  padding: 8px 6px;
  color: ${primary};
  position: absolute;
  bottom: 0;
  background-color: ${secondaryContrast}99;
  width: 100%;
`;

const ServiceTitle = styled(P)`
  margin-bottom: 9px;
  line-height: 1.25em;
`;

const Price = styled.div`
  color: ${lightText};
  flex-grow: 1;
`;

const RatingAndPrice = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StarsWrapper = styled.div`
  margin-bottom: 5px;
`;

const BookableTag = styled(PXSmall)`
  display: inline-block;
  background-color: ${primary};
  border: 1px solid ${primary};
  color: ${lightText};
  border-radius: 2px 2px 2px 0;
  padding: 1px 1px;
  margin-bottom: 5px;
  margin-right: 3px;
`;

function getPriceText(type) {
  if (type === 'Food') {
    return 'per meal';
  }
  if (type === 'Accomodation') {
    return 'per night';
  }
  return 'per person';
}

const Service = ({ data, index }) => {
  //console.log(data)
  const fastBookable =
    data.service.checkoutOptions && data.service.checkoutOptions.payAt === 'please';
  return (
    <Draggable draggableId={`service-${data._id}`} index={index} type={types.SERVICE}>
      {provided => (
        <Wrapper {...provided.draggableProps} ref={provided.innerRef}>
          <ServiceOptions {...provided.dragHandleProps}>
            <Drag style={{ width: '18px', height: '18px' }} />
          </ServiceOptions>
          <ServiceBox img={data.service.media[0].files.thumbnail.url}>
            <ServiceData>
              <ServiceTitle>
                <I18nText data={data.service.title} />
              </ServiceTitle>
              <RatingAndPrice>
                <Price>
                  <PSmallStrong>${data.service.basePrice}</PSmallStrong>
                  <PXSmall>{getPriceText(data.service.categories[0].names['en-us'])}</PXSmall>
                </Price>
                <StarsWrapper>
                  <Stars rating={3} />
                  {fastBookable && <BookableTag>Fast Booking</BookableTag>}
                </StarsWrapper>
              </RatingAndPrice>
            </ServiceData>
          </ServiceBox>
        </Wrapper>
      )}
    </Draggable>
  );
};

Service.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Service;
