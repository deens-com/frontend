// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Slider from 'react-slick';

// COMPONENTS
import ArrowIcon from 'shared_components/icons/ArrowIcon';

// ACTIONS/CONFIG
import { resetButton, media } from '../../../../../libs/styled';

// STYLES
const carouselSizes = {
  medium: {
    overflowPadding: '0',
    overflowMargin: '0',
    cornerWidth: '45px',
    cornerPosition: '-50px',
    btnSize: '48px',
    svgSize: '20px',
  },
  small: {
    overflowPadding: '25px 15px',
    overflowMargin: '-25px -15px',
    cornerWidth: '15px',
    cornerPosition: '-15px',
    btnSize: '28px',
    svgSize: '12px',
  },
};

const Button = styled.button`
  ${resetButton()};
  align-items: center;
  background: white;
  border-radius: ${props => carouselSizes[props.size].btnSize};
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  height: ${props => carouselSizes[props.size].btnSize};
  justify-content: center;
  outline: none;
  position: absolute;
  top: ${props => props.topPosition || '39%'};
  transform: translateY(-50%);
  width: ${props => carouselSizes[props.size].btnSize};
  z-index: 1;
  color: #50a18a;
  ${props =>
    props.position &&
    css`
      ${props.position}: ${props.size === 'small' ? '-5px' : '-25px'};
    `};
`;

const ButtonLeft = styled(Button)`
  left: 0px;
  cursor: pointer;
  ${media.minLarge} {
    left: ${props => (props.size === 'small' ? '-5px' : '-25px')};
  }
  svg {
    transform: rotate(180deg);
  }
  @media (pointer: coarse) {
    display: ${props => (props.hideButtonsOnTouchDevice ? 'none' : 'flex')};
  }
`;

const ButtonRight = styled(Button)`
  right: 0px;
  cursor: pointer;
  ${media.minLarge} {
    right: ${props => (props.size === 'small' ? '-5px' : '-25px')};
  }
  @media (pointer: coarse) {
    display: ${props => (props.hideButtonsOnTouchDevice ? 'none' : 'flex')};
  }
`;

const NextButton = props => {
  const { style, onClick } = props;
  const buttonStyle = style === undefined ? { fill: '#50a18a' } : style;

  return (
    <ButtonRight
      topPosition={props.topPosition}
      position="right"
      onClick={onClick}
      size="medium"
      hideButtonsOnTouchDevice={props.hideButtonsOnTouchDevice}
    >
      <ArrowIcon style={buttonStyle} />
    </ButtonRight>
  );
};

const PrevButton = props => {
  const { style, onClick } = props;
  const defaultStyle = {
    fill: '#50a18a',
    transform: 'rotate(180deg)',
    top: '-1px',
  };
  const buttonStyle = style === undefined ? defaultStyle : style;

  return (
    <ButtonLeft
      topPosition={props.topPosition}
      position="left"
      onClick={onClick}
      size="medium"
      hideButtonsOnTouchDevice={props.hideButtonsOnTouchDevice}
    >
      <ArrowIcon style={buttonStyle} />
    </ButtonLeft>
  );
};

// MODULE
const Carousel = props => {
  const breakpoints = {
    // Small devices (landscape phones, 576px and down)
    small: 576,
    // Medium devices (tablets, 768px and down)
    medium: 768,
    // Large devices (desktops, 992px and down)
    large: 992,
    // Extra large devices (large desktops, 1200px and down)
    extraLarge: 2880,
  };

  const settings = {
    infinite: false,
    speed: 500,
    dots: true,
    lazyLoad: 'ondemand',
    //centerMode: true,
    //initialSlide: 0,
    //slidesToShow: props.xl_slides_nb,
    //slidesToScroll: props.xl_slides_nb,
    responsive: [
      {
        breakpoint: breakpoints.small,
        settings: {
          slidesToShow: props.sm_slides_nb,
          slidesToScroll: props.sm_slides_nb,
        },
      },
      {
        breakpoint: breakpoints.medium,
        settings: {
          slidesToShow: props.md_slides_nb,
          slidesToScroll: props.md_slides_nb,
        },
      },
      {
        breakpoint: breakpoints.large,
        settings: {
          slidesToShow: props.lg_slides_nb,
          slidesToScroll: props.lg_slides_nb,
        },
      },
      {
        breakpoint: breakpoints.extraLarge,
        settings: {
          slidesToShow: props.xl_slides_nb,
          slidesToScroll: props.xl_slides_nb,
        },
      },
    ],
    prevArrow: (
      <PrevButton
        topPosition={props.topPosition}
        hideButtonsOnTouchDevice={props.hideButtonsOnTouchDevice}
      />
    ),
    nextArrow: (
      <NextButton
        topPosition={props.topPosition}
        hideButtonsOnTouchDevice={props.hideButtonsOnTouchDevice}
      />
    ),
  };

  return <Slider {...settings}>{props.children}</Slider>;
};

// Props Validation
Carousel.propTypes = {
  //show: PropTypes.string.isRequired,
  //length: PropTypes.number.isRequired,
  shadowInside: PropTypes.bool,
  withLoader: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  hideButtonsOnTouchDevice: PropTypes.bool,
  topPosition: PropTypes.string,
};

// Default props
Carousel.defaultProps = {
  size: 'medium',
  shadowInside: false,
  withLoader: false,
  hideButtonsOnTouchDevice: false,
};

export default Carousel;
