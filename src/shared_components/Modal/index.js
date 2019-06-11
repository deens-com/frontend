import React, { useEffect, useRef } from 'react';
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

const Dimmer = styled.div`
  z-index: 10;
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  flex-direction: column;
  overflow-y: auto;
  ${media.minMedium} {
    display: block;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 65px;
  height: calc(100vh - 65px);
  left: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  height: 100vh;
  ${media.minMedium} {
    right: 0;
    z-index: 10;
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
  width: 100vw;
  margin: auto;
  flex: 1;
  ${media.minMedium} {
    max-width: 800px;
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
  const childrenRef = useRef(null);

  const onClick = e => {
    onCloseRequest();
  };

  //useEffect(() => changeHeader({ noSearch: true }));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <Dimmer onClick={onClick} />
      <Wrapper>
        <ChildrenContent ref={childrenRef}>
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
