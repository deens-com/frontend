import React, { Component } from "react";
import PropTypes from "prop-types";

export const SvgWithProps = ComposedComponent => {
  return class SvgProps extends Component {
    static propTypes = {
      ariaHidden: PropTypes.bool,
      focusable: PropTypes.string,
      role: PropTypes.string
    };
    static defaultProps = {
      ariaHidden: true,
      focusable: "false",
      role: "presentation"
    };
    render() {
      const style = {
        height: "1em",
        width: "1em",
        display: "block",
        fill: "currentColor"
      };
      return <ComposedComponent {...this.props} style={style} />;
    }
  };
};

export const ArrowIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M17 10H1c-.6 0-1-.4-1-1s.4-1 1-1h16c.6 0 1 .4 1 1s-.4 1-1 1z" />
      <path d="M11 16c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L15.6 9l-5.3-5.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l6 6c.4.4.4 1 0 1.4l-6 6c-.2.2-.4.3-.7.3z" />
    </svg>
  )
);

export const DropArrow = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M5 7.7c-.2 0-.4-.1-.6-.3L1 3.6c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1.1L5 5.8l2.9-3.2c.3-.4.8-.4 1.1-.1.3.3.3.8 0 1.1L5.6 7.4c-.2.2-.4.3-.6.3z" />
    </svg>
  )
);

export const PinIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M3.7 7.7c0 2.4 3.1 7.5 5 10.2.6.9 2 .9 2.6 0 1.8-2.7 5-7.8 5-10.2 0-3.5-2.8-6.3-6.3-6.3S3.7 4.2 3.7 7.7zm8.7-.2c0 1.3-1.1 2.4-2.4 2.4S7.6 8.8 7.6 7.5C7.6 6.1 8.7 5 10 5s2.4 1.1 2.4 2.5z" />
    </svg>
  )
);

export const MicrophoneIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M10.6 15v2.8h2c.3 0 .6.3.6.6s-.3.6-.6.6h-5c-.3 0-.6-.3-.6-.6s.3-.6.6-.6h2V15C6.9 14.7 5 12.6 5 10c0-.3.3-.6.6-.6s.5.3.5.6c0 2.1 1.8 3.9 3.9 3.9s3.9-1.8 3.9-3.9c0-.3.3-.6.6-.6s.5.3.5.6c0 2.6-1.9 4.7-4.4 5zm-3.4-5V3.9c0-1.5 1.3-2.8 2.8-2.8s2.8 1.3 2.8 2.8V10c0 1.5-1.3 2.8-2.8 2.8S7.2 11.5 7.2 10zm1.1 0c0 .9.8 1.7 1.7 1.7s1.7-.8 1.7-1.7V3.9c0-.9-.8-1.7-1.7-1.7S8.3 3 8.3 3.9V10z" />
    </svg>
  )
);

export const SearchIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M12.7 3.6a6.42 6.42 0 0 0-4.6-1.9c-1.7 0-3.3.7-4.6 1.9-1.2 1.2-1.8 2.8-1.8 4.5 0 1.7.7 3.3 1.9 4.6 1.2 1.2 2.8 1.9 4.6 1.9s3.3-.7 4.6-1.9c2.4-2.5 2.4-6.6-.1-9.1zm-.9 8.2c-1 1-2.3 1.5-3.7 1.5-1.4 0-2.7-.5-3.7-1.5S2.9 9.5 2.9 8.1s.5-2.7 1.5-3.7 2.3-1.5 3.7-1.5 2.7.5 3.7 1.5c2 2.1 2 5.4 0 7.4zm6.3 5.4l-3.6-3.6c-.2-.2-.7-.2-.9 0-.2.2-.2.7 0 .9l3.6 3.6c.1.1.3.2.4.2s.3-.1.4-.2c.4-.2.4-.6.1-.9z" />
    </svg>
  )
);

export const DateIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M17.2 3h-1.3c-.2 0-.4.2-.4.5s.2.5.4.5h1.3c.2 0 .4.2.4.5v2.9H2.3v-3c0-.2.2-.4.5-.4h1.6c.2 0 .4-.2.4-.5S4.6 3 4.4 3H2.8c-.8 0-1.4.7-1.4 1.4v12.7c0 .8.6 1.4 1.3 1.4h14.5c.7 0 1.3-.6 1.3-1.4V4.4c.1-.7-.5-1.4-1.3-1.4zm0 14.6H2.8c-.2 0-.4-.2-.4-.5V8.3h15.4v8.9c-.1.2-.3.4-.6.4zM8.9 4H11c.2 0 .4-.2.4-.5.1-.3-.1-.5-.4-.5H8.9c-.2 0-.4.2-.4.5s.2.5.4.5zM6.6 5.7c.5 0 .9-.4.9-1 0-.4-.2-.7-.5-.8v-2c0-.3-.2-.5-.4-.5s-.4.2-.4.5v2c-.4.2-.6.5-.6.9 0 .5.4.9 1 .9zm6.8 0c.5 0 .9-.4.9-1 0-.4-.2-.7-.5-.8v-2c0-.3-.2-.5-.4-.5s-.4.2-.4.5v2c-.3.2-.5.5-.5.8 0 .6.4 1 .9 1z" />
      <path d="M17.2 18.8H2.8c-.8 0-1.5-.7-1.5-1.6V4.4c0-.9.7-1.6 1.5-1.6h1.6c.3.1.6.3.6.7s-.3.6-.6.6H2.8c-.2 0-.3.1-.3.3v2.8h15V4.4c0-.2-.1-.3-.3-.3h-1.3c-.3 0-.6-.3-.6-.6s.3-.6.6-.6h1.3c.8 0 1.5.7 1.5 1.6v12.7c.1.8-.6 1.6-1.5 1.6zM2.8 3.2c-.6 0-1.2.6-1.2 1.2v12.7c0 .7.5 1.2 1.2 1.2h14.5c.6 0 1.2-.6 1.2-1.2V4.4c0-.7-.5-1.2-1.2-1.2H16c-.2 0-.3.1-.3.3 0 .2.1.3.3.3h1.3c.3 0 .6.3.6.6v3.1H2.1V4.4c0-.4.3-.6.6-.6h1.6c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H2.8zm14.4 14.6H2.8c-.3 0-.6-.3-.6-.6v-9h15.7v9c0 .3-.3.6-.7.6zM2.5 8.5v8.7c0 .2.1.3.3.3h14.5c.2 0 .3-.1.3-.3V8.5H2.5zm10.9-2.6c-.6 0-1.1-.5-1.1-1.1 0-.4.2-.7.5-.9v-2c0-.4.3-.6.6-.6s.6.3.6.6v1.9c.3.2.5.6.5.9 0 .7-.5 1.2-1.1 1.2zm0-4.3c-.2 0-.3.1-.3.3V4l-.1.1c-.2.1-.4.4-.4.7 0 .4.3.8.8.8s.8-.4.8-.8c0-.3-.2-.6-.4-.7l-.1-.1V1.9c0-.2-.1-.3-.3-.3zM6.6 5.9c-.6 0-1.1-.5-1.1-1.1 0-.4.2-.7.5-.9v-2c0-.4.3-.6.6-.6s.6.3.6.6v1.9c.3.2.5.6.5 1 0 .6-.5 1.1-1.1 1.1zm0-4.3c-.2 0-.3.1-.3.3V4l-.1.1c-.2.1-.4.4-.4.7 0 .4.3.8.8.8s.8-.4.8-.8c0-.3-.2-.6-.4-.7L6.8 4V1.9c0-.2-.1-.3-.2-.3zM11 4.1H8.9c-.3 0-.6-.3-.6-.6s.3-.6.6-.6H11c.3 0 .6.3.6.6s-.2.6-.6.6zm-2.1-.9c-.2 0-.3.1-.3.3 0 .2.1.3.3.3H11c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H8.9z" />
    </svg>
  )
);

export const PersonIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M17 18.2c0 .5-.3.8-.8.8-.4 0-.8-.4-.8-.8 0-3.2-2.4-5.7-5.4-5.7s-5.4 2.6-5.4 5.7c0 .5-.3.8-.8.8-.4 0-.8-.4-.8-.8 0-4.1 3.1-7.4 7-7.4s7 3.3 7 7.4zM10 10c-2.4 0-4.3-2-4.3-4.5S7.6 1 10 1s4.3 2 4.3 4.5S12.4 10 10 10zm0-1.6c1.5 0 2.7-1.3 2.7-2.9S11.5 2.6 10 2.6 7.3 3.9 7.3 5.5 8.5 8.4 10 8.4z" />
    </svg>
  )
);

export const PlusIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M5.7 4.3h3c.4 0 .7.3.7.7s-.3.7-.7.7h-3v3c0 .4-.3.7-.7.7s-.7-.3-.7-.7v-3h-3C.9 5.7.5 5.4.5 5s.3-.7.7-.7h3v-3c0-.4.3-.7.7-.7s.7.3.7.7v3z" />
    </svg>
  )
);

export const PencilIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M9 3.1L6.9 1 1.7 6.2 1 9l2.8-.7L9 3.1zM2.6 6.3l2.9-2.9 1.1 1.1-2.9 2.9-1.1-1.1zm5.3-3.2l-.7.8-1.1-1.1.8-.8 1 1.1zM2.3 7l.7.7L2 8l.3-1z" />
    </svg>
  )
);

export const FilterIcon = SvgWithProps(
  ({ ariaHidden, focusable, role, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      aria-hidden={ariaHidden}
      focusable={focusable.toString()}
      role={role}
      style={style}
    >
      <path d="M9 1.9H6.3c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h2.7c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3s-.1-.3-.3-.3zm-4 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 7.5h-.6c-.1-.6-.6-1-1.3-1s-1.1.4-1.2 1H1c-.2 0-.3.1-.3.3s.1.3.3.3h4.9c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-1.9 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM9 4.7H4.1c-.1-.6-.6-1-1.3-1s-1.1.4-1.3 1H1c-.2 0-.3.1-.3.3 0 .2.1.3.3.3h.6c.1.6.6 1 1.3 1s1.1-.4 1.3-1H9c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3zm-6.1 1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7s.7.3.7.7c0 .4-.3.7-.7.7z" />
    </svg>
  )
);

export const Logo = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 263.3 135"
    aria-hidden="true"
    focusable="false"
    role="presentation"
    style={style}
  >
    <defs>
      <filter
        id="Adobe_OpacityMaskFilter"
        filterUnits="userSpaceOnUse"
        x="218.3"
        y="7"
        width="29.2"
        height="29.2"
      >
        <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
      </filter>
    </defs>
    <mask
      maskUnits="userSpaceOnUse"
      x="218.3"
      y="7"
      width="29.2"
      height="29.2"
      id="mask-2_1_"
    >
      <g filter="url(#Adobe_OpacityMaskFilter)">
        <path id="path-1_1_" fill="#fff" d="M12.4-18.2h253.7V158H12.4z" />
      </g>
    </mask>
    <path
      id="dot"
      d="M247.6 21.6C247.6 13.5 241 7 233 7c-8.1 0-14.6 6.5-14.6 14.6s6.5 14.6 14.6 14.6c8 0 14.6-6.5 14.6-14.6"
      mask="url(#mask-2_1_)"
      fill="#50a18a"
    />
    <g id="bg">
      <path
        d="M27.5 109.2c-6.3-11.8-10.8-19.2-15.2-32V128c.1-4.7 3.2-17.6 15.2-18.8z"
        fill="#a4d2b6"
      />
      <defs>
        <filter
          id="Adobe_OpacityMaskFilter_1_"
          filterUnits="userSpaceOnUse"
          x="12.3"
          y="36.4"
          width="66.1"
          height="72.8"
        >
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        </filter>
      </defs>
      <mask
        maskUnits="userSpaceOnUse"
        x="12.3"
        y="36.4"
        width="66.1"
        height="72.8"
        id="mask-2_3_"
      >
        <g filter="url(#Adobe_OpacityMaskFilter_1_)">
          <path id="path-1_3_" fill="#fff" d="M12.4-18.2h253.7V158H12.4z" />
        </g>
      </mask>
      <path
        d="M78.4 109.2C64.2 87.4 54 62.8 48.8 36.4c-20.2 0-36.5 16.3-36.5 36.4v4.4c4.3 12.8 8.9 20.2 15.1 32"
        mask="url(#mask-2_3_)"
        fill="#89c8a3"
      />
      <path
        d="M146.5 109c-20.9-19.3-36.3-44.3-44-72.6H48.8c5.3 26.4 15.3 51.1 29.6 72.8l68.1-.2"
        fill="#6ebe99"
      />
      <path
        d="M229.6 94.7c-31.8-7.1-57.9-29.1-70.5-58.3h-56.5c7.6 28.3 22.5 53 44 72.6l54 .2c11.8 0 22.3-5.7 29-14.5"
        fill="#4fb798"
      />
      <path
        d="M229.6 94.7c4.6-6.1 7.3-13.7 7.3-21.9 0-8.1-2.6-15.5-7.1-21.6-2.6 2.5-6.2 4.1-10.1 4.1-8.1 0-14.6-6.5-14.6-14.6 0-1.4.2-2.7.5-3.9-1.7-.2-3.4-.4-5.1-.4h-41.4c12.6 29.2 38.7 51.3 70.5 58.3"
        fill="#50a18a"
      />
    </g>
    <g id="text">
      <path
        fill="#fffffe"
        d="M59.2 71.9c2.5 0 3.9-1.2 3.9-3.1 0-2-1.5-3.1-3.9-3.1h-3.6V72h3.6zm.2-12.2c6.5 0 10.4 3.4 10.4 9.1s-3.9 9.1-10.4 9.1h-3.7v8.3h-6.3V59.7h10z"
      />
      <path
        id="Fill-10"
        fill="#fffffe"
        d="M94.2 80.2v5.9H75.4V59.7h6.3v20.5h12.5"
      />
      <path
        fill="#fffffe"
        d="M119.6 80.2v5.9h-19.4V59.7h19.2v5.9h-12.9v4.3h10.1v5.6h-10.1v4.7h13.1"
      />
      <path
        fill="#fffffe"
        d="M141.3 76.4l-1.9-5.1c-.6-1.5-1.2-3.9-1.3-3.9 0 0-.7 2.4-1.3 3.9l-1.9 5.1h6.4zm2 5.5h-10.5l-1.5 4.2h-6.8l10.6-26.4h6l10.6 26.4h-6.8l-1.6-4.2z"
      />
      <path
        fill="#fffffe"
        d="M169.2 68c-.6-2.3-2.7-3.4-4.6-3.4-1.9 0-3 .9-3 2 0 1.7 2.6 2.4 5.9 3.6 3.9 1.4 8 3.7 8 8.2 0 4.8-4.2 8.3-10.3 8.3-5.5 0-9.4-3.1-11.2-8l6.1-1.6c.7 2 2.6 4 5.4 4 2.3 0 3.3-1.1 3.3-2.3 0-2.1-3.1-2.6-6.9-4.1-3.2-1.2-6.8-2.9-6.8-7.6 0-4.1 4.2-7.9 9.9-7.9 5.1 0 9.1 3.1 10.3 7.3l-6.1 1.5"
      />
      <path
        fill="#fffffe"
        d="M201.1 80.2v5.9h-19.4V59.7h19.2v5.9H188v4.3h10.1v5.6H188v4.7h13.1"
      />
    </g>
  </svg>
);
