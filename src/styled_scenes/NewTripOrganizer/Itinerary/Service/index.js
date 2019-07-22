import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import I18nText from 'shared_components/I18nText';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import Popup from 'shared_components/Popup';
import { types } from '../../constants';
import { PXSmall, P, PStrong } from 'libs/commonStyles';
import { getFirstCategoryLowerCase } from 'libs/categories';
import Star from 'shared_components/icons/Star';
import { generateServiceSlug, extractPrice, getPriceFromServiceOption } from 'libs/Utils';
import urls from 'libs/urlGenerator';
import {
  textLight,
  primary,
  textDark,
  primaryHover,
  error,
  activity,
  food,
  accommodation,
  secondary,
  backgroundDark,
  backgroundLight,
  tertiary,
} from 'libs/colors';
import Drag from 'shared_components/icons/Drag';
import Stars from 'shared_components/Rating/Stars';
import InlineInput from 'shared_components/InlineInput';
import ServiceOptions from './Options';
import ServiceSettings from './Settings';
import { TripContext } from '../../';
import { getImageUrlFromMedia } from 'libs/media';
import Settings from 'shared_components/icons/Settings';
import Activity from 'shared_components/icons/RunningPerson';
import Food from 'shared_components/icons/SilverWare';
import Accommodation from 'shared_components/icons/Bed';

// i18n
import { Trans } from '@lingui/macro';

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
        monitor.getItem().id,
        props.draggingState.day,
        props.data._id,
        props.data.day,
      );
      props.changeDraggingService(props.data.day, props.index);
    }
  },
  drop(props, monitor, component) {
    props.onServiceDrop();
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
  width: 190px;
  margin-top: 40px;
`;

const DraggingBox = styled.div`
  margin-top: 35px;
  background-color: ${primary};
  border: 1px solid ${primaryHover};
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

const PriceNumber = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const ServiceData = styled.div`
  color: ${textDark};
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const ServiceTitle = styled(P)`
  padding: 8px 6px 0;
  background-color: rgba(255, 255, 255, 0.9);
`;

const Price = styled.div`
  flex-grow: 1;
`;

const RatingAndPrice = styled.div`
  display: flex;
  align-items: flex-end;
  background: ${backgroundDark};
  padding: 8px 6px;
`;

const StarsWrapper = styled.div`
  > div {
    margin-bottom: 5px;
  }
  text-align: center;
`;

const Reviews = styled(PXSmall)`
  display: inline-block;
  color: ${primary};
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
`;

function getPriceText(type) {
  if (type === 'Food') {
    return <Trans>per meal</Trans>;
  }
  if (type === 'Accommodation') {
    return <Trans>per night</Trans>;
  }
  return <Trans>per person</Trans>;
}

const ServiceIcon = ({ type }) => {
  if (type === 'food') {
    return <Food style={{ color: food }} />;
  }
  if (type === 'accommodation') {
    return <Accommodation style={{ color: accommodation }} />;
  }

  return <Activity style={{ color: activity }} />;
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
  servicesByDay,
  selectedOptions,
}) => {
  const {
    isCheckingAvailability,
    removeService,
    changeServiceTitle,
    changeServicePrice,
    tripData,
  } = useContext(TripContext);
  const fastBookable =
    data.service.checkoutOptions && data.service.checkoutOptions.payAt === 'please';
  const isAvailable = !data.availability || data.availability.isAvailable;
  const options =
    data.availability &&
    data.availability.groupedOptions &&
    data.availability.groupedOptions.options;

  const setServicePrice = price => {
    changeServicePrice(data.service._id, data.day, price);
  };

  const setServiceTitle = title => {
    changeServiceTitle(data.service._id, data.day, title);
  };

  return connectDragPreview(
    connectDropTarget(
      <div>
        {isDragging ? (
          <DraggingBox />
        ) : (
          <Wrapper>
            <ServiceBox
              isNotAvailable={!isCheckingAvailability && !isAvailable}
              img={getImageUrlFromMedia(data.service.media)}
            >
              {connectDragSource(
                <div
                  style={{
                    background: backgroundDark,
                    padding: '5px',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'grab',
                    borderRadius: '0 0 3px 3px',
                  }}
                >
                  <Drag style={{ width: '30px', height: 'auto' }} />
                </div>,
              )}
              <Popup
                trigger={
                  <span
                    style={{
                      borderRadius: '0 0 0 5px',
                      backgroundColor: backgroundLight,
                      padding: '3px',
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <Settings style={{ color: primary, width: '14px', height: '14px' }} />
                  </span>
                }
                content={
                  <ServiceSettings
                    servicesByDay={servicesByDay}
                    removeService={removeService}
                    service={data}
                  />
                }
                on="click"
                position="bottom center"
                hideOnScroll
              />
              <ServiceData>
                <ServiceTitle>
                  {getFirstCategoryLowerCase(data.service.categories) === 'accommodation' &&
                    data.service.accommodationProps &&
                    data.service.accommodationProps.stars && (
                      <>
                        <span style={{ fontWeight: 'bold', color: tertiary }}>
                          {data.service.accommodationProps.stars}
                        </span>
                        <Star
                          style={{
                            display: 'inline-block',
                            marginRight: '5px',
                            paddingTop: '3px',
                            color: tertiary,
                          }}
                        />
                      </>
                    )}
                  {data.service.privacy === 'private' ? (
                    <InlineInput disallowEmptySubmit onChanged={setServiceTitle}>
                      {I18nText.translate(data.service.title)}
                    </InlineInput>
                  ) : (
                    I18nText.translate(data.service.title)
                  )}
                </ServiceTitle>
                <RatingAndPrice>
                  <Price>
                    <PriceNumber>
                      {data.service.privacy === 'private' ? (
                        <InlineInput
                          textPrefix="$"
                          inputTextColor={textDark}
                          onChanged={setServicePrice}
                        >
                          {getPriceFromServiceOption(
                            data.service.basePrice,
                            selectedOptions[data.selectedOption] &&
                              selectedOptions[data.selectedOption].price,
                            tripData.adultCount,
                            tripData.childrenCount,
                          )}
                        </InlineInput>
                      ) : (
                        <p>
                          $
                          {getPriceFromServiceOption(
                            data.service.basePrice,
                            selectedOptions[data.selectedOption] &&
                              selectedOptions[data.selectedOption].price,
                            tripData.adultCount,
                            tripData.childrenCount,
                          )}
                        </p>
                      )}
                    </PriceNumber>
                    <PXSmall style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                      {getPriceText(data.service.categories[0].names)}
                    </PXSmall>
                    <span
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginLeft: '5px',
                      }}
                    >
                      <ServiceIcon type={getFirstCategoryLowerCase(data.service.categories)} />
                    </span>
                  </Price>
                  <StarsWrapper>
                    {data.service.privacy === 'public' &&
                      data.service.ratings &&
                      data.service.ratings.count > 0 && (
                        <Stars useLogo rating={data.service.ratings.average} />
                      )}
                    {data.service.ratings &&
                      data.service.ratings.count > 0 && (
                        <Reviews>
                          <Link
                            style={{ color: primary }}
                            to={urls.service.view({
                              id: data.service._id,
                              slug: generateServiceSlug(data.service),
                              category: getFirstCategoryLowerCase(data.service.categories),
                            })}
                          >
                            {data.service.ratings.count} <Trans>reviews</Trans>
                          </Link>
                        </Reviews>
                      )}
                  </StarsWrapper>
                </RatingAndPrice>
              </ServiceData>
            </ServiceBox>
            {!isCheckingAvailability && (
              <>
                {!isAvailable && (
                  <NotAvailable>
                    <Trans>Not available</Trans>
                  </NotAvailable>
                )}
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
  onServiceDrop: PropTypes.func.isRequired,
};

export default DropTarget(types.SERVICE, serviceTarget, connectTarget)(
  DragSource(types.SERVICE, serviceSource, collect)(Service),
);
