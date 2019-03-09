import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { DragSource, DropTarget } from 'react-dnd';
import { types } from '../constants';
import { P, PSmallStrong, PXSmall } from 'libs/commonStyles';
import { lightText, primary, primaryContrast, secondaryContrast, error } from 'libs/colors';
import { Drag } from 'shared_components/icons';
import Stars from 'shared_components/Rating/Stars';
import ServiceOptions from './ServiceOptions';

const serviceSource = {
  beginDrag(props) {
    props.startDraggingService(props.data.day, props.data._id, props.index);

    return {
      id: props.data._id,
      day: props.data.day,
    };
  },
  isDragging(props, monitor) {
    return props.data._id === monitor.getItem().id;
  },
  endDrag(props) {
    props.endDraggingService();
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const serviceTarget = {
  hover(props, monitor) {
    if (monitor.getItemType() !== types.SERVICE) {
      return;
    }
    if (monitor.getItem().id !== props.data._id) {
      props.changeServicePosition(
        props.draggingState.day,
        props.draggingState.position,
        props.data.day,
        props.index,
      );
      props.changeDraggingService(props.data.day, props.index);
    }
  },
};

const connectTarget = connect => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DraggingBox = styled.div`
  margin-top: 35px;
  background-color: ${primary};
  border: 1px solid ${primaryContrast};
  width: 190px;
  height: 225px;
  border-radius: 10px 10px 10px 0;
`;

const ServiceBox = styled.div`
  background: ${props => (props.img ? `url(${props.img})` : 'gray')};
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 10px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  width: 190px;
  height: 225px;
  position: relative;
  overflow: hidden;
  ${props =>
    props.isNotAvailable &&
    `
    border: 2px solid ${error};
  `};
`;

const NotAvailable = styled(PXSmall)`
  position: absolute;
  bottom: -25px;
  right: 0;
  color: ${error};
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

const serviceOptionsStyle = {
  display: 'flex',
  height: '35px',
  borderRadius: '5px 5px 0 0',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  borderBottom: 0,
  boxShadow: '1px 1px rgba(0, 0, 0, 0.05)',
  backgroundColor: 'white',
  padding: '8px',
  margin: 'auto',
  cursor: 'grabbing',
};

const Service = ({
  data,
  index,
  draggingState,
  connectDragSource,
  connectDragPreview,
  isDragging,
  connectDropTarget,
  selectOption,
}) => {
  const fastBookable =
    data.service.checkoutOptions && data.service.checkoutOptions.payAt === 'please';
  const isAvailable = !data.availability || data.availability.isAvailable;
  const options =
    data.availability &&
    data.availability.groupedOptions &&
    data.availability.groupedOptions.options;

  return connectDragPreview(
    connectDropTarget(
      <div>
        {isDragging ? (
          <DraggingBox />
        ) : (
          <Wrapper>
            {connectDragSource(
              <div style={serviceOptionsStyle}>
                <Drag style={{ width: '18px', height: '18px' }} />
              </div>,
            )}
            <ServiceBox
              isNotAvailable={!isAvailable}
              img={data.service.media[0].files.thumbnail.url}
            >
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
            {!isAvailable && <NotAvailable>Not available</NotAvailable>}
            {options && (
              <ServiceOptions selectOption={selectOption} options={options} serviceData={data} />
            )}
          </Wrapper>
        )}
      </div>,
    ),
  );
};

Service.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  draggingState: PropTypes.shape({
    day: PropTypes.number.isRequired,
    id: PropTypes.string,
    position: PropTypes.number,
  }),
  startDraggingService: PropTypes.func.isRequired,
  changeDraggingService: PropTypes.func.isRequired,
  endDraggingService: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
};

export default DropTarget(types.SERVICE, serviceTarget, connectTarget)(
  DragSource(types.SERVICE, serviceSource, collect)(Service),
);
