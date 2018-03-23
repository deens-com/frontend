// NPM
import React from "react";
import PropTypes from "prop-types";

// COMPONENTS
import Button from "../Button";

// ACTIONS/CONFIG

// MODULE
export default function Trigger({ expanded, ...rest }) {
  return (
    <Button
      type="button"
      tabindex="0"
      aria-haspopup="true"
      aria-expanded={expanded}
      {...rest}
    />
  );
}

// Props Validation
Trigger.propTypes = {};
