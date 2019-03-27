import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { DragSource, DropTarget } from 'react-dnd';
import { Popup } from 'semantic-ui-react'
import { types } from '../../constants';
import { P, PSmallStrong, PXSmall } from 'libs/commonStyles';
import { lightText, primary, darkText, primaryContrast, secondaryContrast, error, activity, food, accommodation } from 'libs/colors';
import { Drag } from 'shared_components/icons';
import Stars from 'shared_components/Rating/Stars';
import InlineInput from 'shared_components/InlineInput'
import ServiceOptions from './Options';
import ServiceSettings from './Settings';
import { TripContext } from '../../';
import { getImageUrlFromMedia } from 'libs/media'
import { Activity, Food, Accommodation, Settings } from 'shared_components/icons';

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
  > div {
    margin-bottom: 5px;
  }
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

const ServiceSettingsButton = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  border-radius: 5px 5px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 0;
  box-shadow: 1px 1px rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 8px;
  margin: auto;

  > svg {
    font-size: 24px;
    margin-left: 15px;
  }
`

function getPriceText(type) {
  if (type === 'Food') {
    return 'per meal';
  }
  if (type === 'Accommodation') {
    return 'per night';
  }
  return 'per person';
}

const ServiceIcon = ({ type }) => {
  if (type === 'Food') {
    return <Food style={{ color: food }} />
  }
  if (type === 'Accommodation') {
    return <Accommodation style={{ color: accommodation }} />
  }

  return <Activity style={{ color: activity }} />
}

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
  const { isCheckingAvailability, removeService, changeServiceTitle, changeServicePrice } = useContext(TripContext);
  const fastBookable =
    data.service.checkoutOptions && data.service.checkoutOptions.payAt === 'please';
  const isAvailable = !data.availability || data.availability.isAvailable;
  const options =
    data.availability &&
    data.availability.groupedOptions &&
    data.availability.groupedOptions.options;

  const setServicePrice = (price) => {
    changeServicePrice(data.service._id, data.day, price)
  }

  const setServiceTitle = (title) => {
    changeServiceTitle(data.service._id, data.day, title)
  }

  return connectDragPreview(
    connectDropTarget(
      <div>
        {isDragging ? (
          <DraggingBox />
        ) : (
          <Wrapper>
            <ServiceSettingsButton>
              {connectDragSource(
                <div style={{cursor: 'grabbing'}}>
                  <Drag style={{ width: '18px', height: '18px' }} />
                </div>,
              )}
              <ServiceIcon type={data.service.categories[0].names['en-us']} />
              <Popup
                trigger={
                  <span style={{cursor: 'pointer', marginLeft: '15px'}}>
                    <Settings style={{ color: primary, width: '20px', height: '20px' }} />
                  </span>
                }
                content={<ServiceSettings removeService={removeService} service={data} />}
                on="click"
                position="bottom center"
                hideOnScroll
              />
            </ServiceSettingsButton>
            <ServiceBox
              isNotAvailable={!isCheckingAvailability && !isAvailable}
              img={getImageUrlFromMedia(data.service.media)}
            >
              <ServiceData>
                <ServiceTitle>
                  {data.service.privacy === 'private' ? (
                    <InlineInput disallowEmptySubmit onChanged={setServiceTitle}>
                      {I18nText.translate(data.service.title)}
                    </InlineInput>
                  ) : I18nText.translate(data.service.title)}
                </ServiceTitle>
                <RatingAndPrice>
                  <Price>
                    <PSmallStrong>
                      {data.service.privacy === 'private' ? (
                        <InlineInput textPrefix="$" inputTextColor={darkText} onChanged={setServicePrice}>
                          {data.service.basePrice}
                        </InlineInput>
                      ) : `$${data.service.basePrice}`}
                    </PSmallStrong>
                    <PXSmall>{getPriceText(data.service.categories[0].names['en-us'])}</PXSmall>
                  </Price>
                  <StarsWrapper>
                    {
                      data.service.privacy === 'public' && data.service.ratings && <Stars rating={data.service.ratings.average} />
                    }
                    {fastBookable && <BookableTag>Fast Booking</BookableTag>}
                  </StarsWrapper>
                </RatingAndPrice>
              </ServiceData>
            </ServiceBox>
            {!isCheckingAvailability && (
              <>
                {!isAvailable && <NotAvailable>Not available</NotAvailable>}
                {options && (
                  <ServiceOptions
                    selectOption={selectOption}
                    options={options}
                    serviceData={data}
                  />
                )}
              </>
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
