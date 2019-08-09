import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import Popup from 'shared_components/Popup';
import { types } from '../../constants';
import { PXSmall, P } from 'libs/commonStyles';
import { getFirstCategoryLowerCase } from 'libs/categories';
import Star from 'shared_components/icons/Star';
import { generateServiceSlug, getPriceFromServiceOption } from 'libs/Utils';
import urls from 'libs/urlGenerator';
import { media } from 'libs/styled';
import {
  primary,
  textDark,
  primaryHover,
  error,
  backgroundDark,
  backgroundLight,
  tertiary,
} from 'libs/colors';
import Drag from 'shared_components/icons/Drag';
import Stars from 'shared_components/Rating/Stars';
import ServiceSettings from './Settings';
import { TripContext } from '../../';
import { getImageUrlFromMedia } from 'libs/media';
import Settings from 'shared_components/icons/Settings';
import ArrowIcon from 'shared_components/icons/UpArrow';
import ServiceIcon from 'shared_components/ServiceIcon';

// i18n
import { Trans } from '@lingui/macro';

const serviceSource = {
  beginDrag(props) {
    props.startDraggingService(props.data.day, props.data._id, props.index);

    return {
      id: props.data._id,
      day: props.data.day,
      service: props.data.service && props.data.service._id,
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
    if (
      props.data.day !== monitor.getItem().day &&
      props.serviceIdByDay[props.data.day][monitor.getItem().service]
    ) {
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
  margin-top: 20px;
  ${media.minLargePlus} {
    width: 190px;
    margin-top: 40px;
  }
`;

const DraggingBox = styled.div`
  margin-top: 35px;
  background-color: ${primary};
  border: 1px solid ${primaryHover};
  width: 190px;
  height: 225px;
  border-radius: 10px 10px 10px 0;
`;

const SettingsTrigger = styled.span`
  cursor: pointer;
  padding: 3px 5px;
  color: ${primary};
  display: flex;
  align-items: center;
  margin-left: 10px;
  border-left: 1px solid ${backgroundDark};
  font-size: 18px;
  flex-direction: column;
  justify-content: center;
  ${media.minLargePlus} {
    border-radius: 0 0 0 5px;
    background-color: ${backgroundLight};
    position: absolute;
    padding: 3px;
    right: 0;
    top: 0;
    border-left: 0;
    margin-left: 0;
    font-size: 14px;
    display: initial;
  }
`;

const ServiceIconMobile = styled.span`
  ${media.minLargePlus} {
    display: none;
  }
`;

const ServiceBox = styled.div`
  background: white;
  border-radius: 10px 10px 10px 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-height: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  ${props =>
    props.isNotAvailable &&
    `
    border: 2px solid ${error};
  `};
  ${media.minLargePlus} {
    width: 190px;
    height: 225px;
    background: ${props => (props.img ? `url(${props.img})` : 'gray')};
    background-size: cover;
    background-position: center;
    display: block;
  }
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
  display: inline-block;
  ${media.minLargePlus} {
    display: block;
  }
`;

const DragWrapper = styled.div`
  display: none;
  ${media.minLargePlus} {
    display: block;
  }
`;

const ServiceData = styled.div`
  color: ${textDark};
  display: flex;
  justify-content: flex-end;
  flex: 1;
  ${media.minLargePlus} {
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    flex: 0 1 auto;
  }
`;

const ServiceTitle = styled(P)`
  background-color: rgba(255, 255, 255, 0.9);
  align-self: center;
  ${media.minLargePlus} {
    padding: 8px 6px 0;
    align-self: center;
  }
`;

const Price = styled.div`
  text-align: right;
  flex-grow: 1;
  ${media.minLargePlus} {
    text-align: left;
  }
`;

const RatingAndPrice = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin-left: auto;
  ${media.minLargePlus} {
    background: ${backgroundDark};
    flex-direction: row;
    padding: 8px 6px;
    margin-left: 0;
  }
`;

const ServiceIconWrapper = styled.span`
  display: none;
  vertical-align: middle;
  margin-left: 5px;
  ${media.minLargePlus} {
    display: inline-block;
  }
`;

const StarsWrapper = styled.div`
  > div {
    margin-bottom: 5px;
  }
  text-align: center;
`;

const Reviews = styled(PXSmall)`
  display: none;
  color: ${primary};
  ${media.minLargePlus} {
    display: inline-block;
  }
`;

const ArrowWrapper = styled.span`
  cursor: pointer;
`;

const ArrowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 5px;
  ${media.minLargePlus} {
    display: none;
  }
`;

function getPriceText(type, numberOfPeople) {
  if (type === 'Food') {
    return <Trans>per meal</Trans>;
  }
  if (type === 'Accommodation') {
    return <Trans>per night</Trans>;
  }
  return <Trans>for {numberOfPeople} people</Trans>;
}

const Service = ({
  data,
  index,
  draggingState,
  connectDragSource,
  connectDragPreview,
  isDragging,
  connectDropTarget,
  servicesByDay,
  selectedOptions,
  serviceIdByDay,
  isFirstOfDay,
  isLastOfDay,
  isLastDay,
}) => {
  const {
    isCheckingAvailability,
    removeService,
    openEditService,
    changeServiceTitle,
    changeServicePrice,
    tripData,
    moveServiceAndSave,
  } = useContext(TripContext);
  const fastBookable =
    data.service.checkoutOptions && data.service.checkoutOptions.payAt === 'please';
  const isAvailable = !data.availability || data.availability.isAvailable;
  const options =
    data.availability &&
    data.availability.groupedOptions &&
    data.availability.groupedOptions.options;

  const wrapTitle = content => {
    if (data.service.privacy !== 'private') {
      return (
        <Link
          to={urls.service.view({
            id: data.service._id,
            slug: generateServiceSlug(data.service),
            category: getFirstCategoryLowerCase(data.service.categories),
          })}
        >
          {content}
        </Link>
      );
    }
    return content;
  };

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const moveServiceUp = () => {
    if (isFirstOfDay) {
      if (!(serviceIdByDay[data.day - 1] && serviceIdByDay[data.day - 1][data.service._id])) {
        moveServiceAndSave(data._id, data.day, null, data.day - 1, 'up');
      }
      return;
    }
    moveServiceAndSave(data._id, data.day, null, data.day, 'up');
  };

  const moveServiceDown = () => {
    if (isLastOfDay) {
      if (!(serviceIdByDay[data.day + 1] && serviceIdByDay[data.day + 1][data.service._id])) {
        moveServiceAndSave(data._id, data.day, null, data.day + 1, 'down');
      }
      return;
    }
    moveServiceAndSave(data._id, data.day, null, data.day, 'down');
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
              <DragWrapper>
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
              </DragWrapper>
              <ArrowsWrapper>
                {(!isFirstOfDay || data.day !== 1) && (
                  <ArrowWrapper onClick={moveServiceUp}>
                    <ArrowIcon
                      style={{
                        width: '18px',
                      }}
                    />
                  </ArrowWrapper>
                )}
                {(!isLastOfDay || !isLastDay) && (
                  <ArrowWrapper onClick={moveServiceDown}>
                    <ArrowIcon
                      style={{
                        transform: 'rotate(180deg)',
                        width: '19px',
                      }}
                    />
                  </ArrowWrapper>
                )}
              </ArrowsWrapper>
              <ServiceData>
                <ServiceTitle>
                  {wrapTitle(
                    <>
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
                      {data.service.title}
                    </>,
                  )}
                </ServiceTitle>
                <RatingAndPrice>
                  <Price>
                    <PriceNumber>
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
                    </PriceNumber>{' '}
                    <PXSmall style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                      {getPriceText(
                        data.service.categories[0].names,
                        (tripData.adultCount || 0) + (tripData.childrenCount || 0),
                      )}
                    </PXSmall>
                    <ServiceIconWrapper>
                      <ServiceIcon type={getFirstCategoryLowerCase(data.service.categories)} />
                    </ServiceIconWrapper>
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
              <Popup
                trigger={
                  <SettingsTrigger>
                    <ServiceIconMobile>
                      <ServiceIcon type={getFirstCategoryLowerCase(data.service.categories)} />
                    </ServiceIconMobile>
                    <Settings />
                  </SettingsTrigger>
                }
                content={
                  <ServiceSettings
                    servicesByDay={servicesByDay}
                    removeService={removeService}
                    editService={openEditService}
                    service={data}
                    close={() => setSettingsOpen(false)}
                  />
                }
                open={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                onOpen={() => setSettingsOpen(true)}
                on="click"
                position="bottom center"
              />
            </ServiceBox>
            {!isCheckingAvailability && (
              <>
                {!isAvailable && (
                  <NotAvailable>
                    <Trans>Not available</Trans>
                  </NotAvailable>
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
    service: PropTypes.object,
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
