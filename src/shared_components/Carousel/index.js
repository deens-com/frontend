// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Slider from "react-slick";

// COMPONENTS
import { ArrowIcon } from "../icons";
import Row from "../layout/Row";

// ACTIONS/CONFIG
import { resetButton, media } from "../../libs/styled";

// STYLES
const carouselSizes = {
  medium: {
    overflowPadding: "0",
    overflowMargin: "0",
    cornerWidth: "45px",
    cornerPosition: "-50px",
    btnSize: "48px",
    svgSize: "20px"
  },
  small: {
    overflowPadding: "25px 15px",
    overflowMargin: "-25px -15px",
    cornerWidth: "15px",
    cornerPosition: "-15px",
    btnSize: "28px",
    svgSize: "12px"
  }
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
  top: 48%;
  transform: translateY(-50%);
  width: ${props => carouselSizes[props.size].btnSize};
  z-index: 10;
  color: #50a18a;
  ${props =>
    props.position &&
    css`
      ${props.position}: ${props.size === "small" ? "-5px" : "-25px"};
    `};
`;

const ButtonLeft = Button.extend`
  left: 0px;
  cursor: pointer;
  ${media.minLarge} {
    left: ${props => (props.size === "small" ? "-5px" : "-25px")};
  }
  svg {
    transform: rotate(180deg);
  }
`;

const ButtonRight = Button.extend`
  right: 0px;
  cursor: pointer;
  ${media.minLarge} {
    right: ${props => (props.size === "small" ? "-5px" : "-25px")};
  }
`;

const NextButton = props => {
  const { style, onClick } = props;
  const buttonStyle = style === undefined ? { fill: "#50a18a" } : style;

  return (
    <ButtonRight position="right" onClick={onClick} size="medium">
      <ArrowIcon style={buttonStyle} />
    </ButtonRight>
  );
};

const PrevButton = props => {
  const { style, onClick } = props;
  const defaultStyle = {
    fill: "#50a18a",
    transform: "rotate(180deg)",
    top: "-1px"
  };
  const buttonStyle = style === undefined ? defaultStyle : style;

  return (
    <ButtonLeft position="left" onClick={onClick} size="medium">
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
    extraLarge: 1450
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
          slidesToScroll: props.sm_slides_nb
        }
      },
      {
        breakpoint: breakpoints.medium,
        settings: {
          slidesToShow: props.md_slides_nb,
          slidesToScroll: props.md_slides_nb
        }
      },
      {
        breakpoint: breakpoints.large,
        settings: {
          slidesToShow: props.lg_slides_nb,
          slidesToScroll: props.lg_slides_nb
        }
      },
      {
        breakpoint: breakpoints.extraLarge,
        settings: {
          slidesToShow: props.xl_slides_nb,
          slidesToScroll: props.xl_slides_nb
        }
      }
    ],
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />
  };

  return <Slider {...settings}>{props.children}</Slider>;
};

// Props Validation
Carousel.propTypes = {
  show: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  shadowInside: PropTypes.bool,
  withLoader: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

// Default props
Carousel.defaultProps = {
  size: "medium",
  shadowInside: false,
  withLoader: false
};

export default Carousel;





















// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import styled, { css } from "styled-components";
//
// import { ArrowIcon } from "../icons";
// import Row from "../layout/Row";
//
// import { resetButton, media } from "../../libs/styled";
//
// const carouselSizes = {
//   medium: {
//     overflowPadding: "0",
//     overflowMargin: "0",
//     cornerWidth: "45px",
//     cornerPosition: "-50px",
//     btnSize: "48px",
//     svgSize: "20px"
//   },
//   small: {
//     overflowPadding: "25px 15px",
//     overflowMargin: "-25px -15px",
//     cornerWidth: "15px",
//     cornerPosition: "-15px",
//     btnSize: "28px",
//     svgSize: "12px"
//   }
// };
//
// const Wrap = styled(Row)`
//   position: relative;
// `;
//
// const Overflow = styled.div`
//   overflow: hidden;
//
//   ${media.minSmall} {
//     ${props =>
//       props.shadowInside &&
//       css`
//         padding: ${carouselSizes[props.size].overflowPadding};
//         margin: ${carouselSizes[props.size].overflowMargin};
//       `};
//   }
// `;
//
// const Mover = styled.div`
//   transform: translateX(0);
//   transition: transform 0.4s ease-out;
// `;
//
// const Inner = styled.div`
//   white-space: nowrap;
// `;
//
// const Loader = styled.span`
//   display: inline-block;
//   position: absolute;
//   top: 50%;
//   width: ${props => props.width + "%"};
//   text-align: center;
//   transform: translate(0%, -50%);
// `;
//
// const Button = styled.button`
//   ${resetButton()};
//   align-items: center;
//   background: white;
//   border-radius: ${props => carouselSizes[props.size].btnSize};
//   box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
//   display: flex;
//   height: ${props => carouselSizes[props.size].btnSize};
//   justify-content: center;
//   outline: none;
//   position: absolute;
//   top: 48%;
//   transform: translateY(-50%);
//   width: ${props => carouselSizes[props.size].btnSize};
//   z-index: 10;
//   color: #50a18a;
//
//   ${props =>
//     props.position &&
//     css`
//       ${props.position}: ${props.size === "small" ? "-5px" : "-25px"};
//     `};
// `;
//
// const ButtonLeft = Button.extend`
//   left: 0px;
//   cursor: pointer;
//
//   ${media.minLarge} {
//     left: ${props => (props.size === "small" ? "-5px" : "-25px")};
//   }
//
//   svg {
//     transform: rotate(180deg);
//   }
// `;
//
// const ButtonRight = Button.extend`
//   right: 0px;
//   cursor: pointer;
//
//   ${media.minLarge} {
//     right: ${props => (props.size === "small" ? "-5px" : "-25px")};
//   }
// `;
//
// export default class Carousel extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       index: 1,
//       inTransition: false
//     };
//
//     this.resetTransition = this.resetTransition.bind(this);
//     this.moveLeft = this.moveLeft.bind(this);
//     this.moveRight = this.moveRight.bind(this);
//   }
//
//   resetTransition() {
//     setTimeout(() => {
//       this.setState({ inTransition: false });
//     }, 200);
//   }
//
//   moveLeft() {
//     this.setState({ index: this.state.index - 1, inTransition: true });
//     this.resetTransition();
//   }
//
//   moveRight() {
//     this.setState({ index: this.state.index + 1, inTransition: true });
//     this.resetTransition();
//   }
//
//   renderPreviousButton() {
//     if (this.state.index === 1) {
//       return null;
//     }
//
//     return (
//       <ButtonLeft
//         position="left"
//         onClick={this.moveLeft}
//         size={this.props.size}
//       >
//         <ArrowIcon
//           style={{
//             fill: "#50a18a",
//             transform: "rotate(180deg)",
//             top: "-1px"
//           }}
//         />
//       </ButtonLeft>
//     );
//   }
//
//   renderNextButton() {
//     const show = ~~this.props.show;
//     const propsPages = Math.ceil(this.props.length / show);
//     const remainingEls = this.props.length % show;
//     const pages =
//       this.props.withLoader && remainingEls === 0 ? propsPages + 1 : propsPages;
//
//     if (this.state.index >= pages) {
//       return null;
//     }
//
//     return (
//       <ButtonRight
//         position="right"
//         onClick={this.moveRight}
//         size={this.props.size}
//       >
//         <ArrowIcon style={{ fill: "#50a18a" }} />
//       </ButtonRight>
//     );
//   }
//
//   renderLoader() {
//     if (!this.props.withLoader) {
//       return null;
//     }
//
//     const show = ~~this.props.show;
//
//     return (
//       <Loader width={(100 / show).toFixed(2)} offset={this.props.length % show}>
//         Load more...
//       </Loader>
//     );
//   }
//
//   render() {
//     const show = ~~this.props.show;
//     const modChildren = React.Children.map(
//       this.props.children,
//       (child, index) => {
//         const childPageIndex = Math.ceil((index + 1) / show);
//         if (!this.state.inTransition && childPageIndex !== this.state.index) {
//           return React.cloneElement(child, {
//             withShadow: false
//           });
//         }
//         return child;
//       }
//     );
//
//     return (
//       <Wrap shadowInside={this.props.shadowInside}>
//         <Overflow
//           inTransition={this.state.inTransition}
//           shadowInside={this.props.shadowInside}
//           size={this.props.size}
//         >
//           <Mover
//             style={{
//               transform: `translateX(-${this.state.index * 100 - 100}%)`
//             }}
//           >
//             <Inner>
//               {modChildren}
//               {this.renderLoader()}
//             </Inner>
//           </Mover>
//         </Overflow>
//
//         {this.renderPreviousButton()}
//         {this.renderNextButton()}
//       </Wrap>
//     );
//   }
// }
//
// Carousel.propTypes = {
//   show: PropTypes.string.isRequired,
//   length: PropTypes.number.isRequired,
//   shadowInside: PropTypes.bool,
//   withLoader: PropTypes.bool,
//   size: PropTypes.string,
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node
//   ]).isRequired
// };
//
// Carousel.defaultProps = {
//   size: "medium",
//   shadowInside: false,
//   withLoader: false
// };
