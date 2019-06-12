import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Portal from 'shared_components/Portal';
import { media } from 'libs/styled';
import { primary } from 'libs/colors';
import BrandFooter from 'shared_components/BrandFooter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';
import CrossIcon from 'shared_components/icons/CrossIcon';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'libs/body-scroll-lock';

const Dimmer = styled.div`
  z-index: 10;
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  flex-direction: column;
  pointer-events: all;
  ${media.minMedium} {
    display: block;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 65px;
  bottom: 0;
  width: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  ${media.minMedium} {
    right: 0;
    margin: auto;
    z-index: 10;
    bottom: initial;
    max-width: 815px;
  }
`;

const Footer = styled.div`
  pointer-events: all;
  ${media.minMedium} {
    display: none;
  }
`;

const ChildrenContent = styled.div`
  background-color: white;
  pointer-events: all;
  position: relative;
  padding: 35px;
  width: 100%;
  margin: auto;
  flex: 1;
  ${media.minMedium} {
    border-radius: 10px;
    flex: 0;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  color: ${primary};
  border: 1px solid ${primary};
  border-radius: 10px;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Modal = ({ open, onCloseRequest, changeHeader, children }) => {
  const contentRef = useRef(null);
  const dimmerRef = useRef(null);
  const onClick = e => {
    onCloseRequest();
  };

  useLayoutEffect(
    () => {
      const scrollable = contentRef.current;
      const allowTouchMove = el => el === dimmerRef.current;
      if (open) {
        disableBodyScroll(scrollable, { allowTouchMove });
      } else {
        enableBodyScroll(scrollable);
        clearAllBodyScrollLocks();
      }
      return () => {
        enableBodyScroll(scrollable);
        clearAllBodyScrollLocks();
      };
    },
    [open],
  );

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <Dimmer ref={dimmerRef} onClick={onClick} />
      <Wrapper ref={contentRef}>
        <ChildrenContent>
          <CloseButton onClick={onClick}>
            <CrossIcon style={{ width: 18, height: 18 }} />
          </CloseButton>
          <div style={{ margin: '0 auto' }}>{children}</div>
        </ChildrenContent>
        <Footer>
          <BrandFooter />
        </Footer>
      </Wrapper>
    </Portal>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onCloseRequest: PropTypes.func,
  children: PropTypes.node,
};

Modal.defaultProps = {
  open: false,
  onCloseRequest: () => {},
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(Modal);
