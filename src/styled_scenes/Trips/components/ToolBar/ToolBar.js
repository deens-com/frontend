import React from 'react';
import styled from 'styled-components';

import OwnerToolBar from './OwnerToolBar';
import NonOwnerToolBar from './NonOwnerToolBar';
import { media } from 'libs/styled';
import toolbarProptypes from './toolbar-proptypes';

const Wrap = styled.div`
  border-bottom: 1px solid #eef1f4;
  padding: 10px;
  // height: 65px;
  display: flex;
  background: #ffffff;
  width: 100%;
  z-index: 18;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);

  ${media.minSmall} {
    height: 70px;
  }

  ${media.minMedium} {
    height: 95px;
    padding: 25px;
    height: auto;
    position: static;
    width: auto;
    z-index: 0;
    box-shadow: none;
  }

  > div,
  > form > div {
    margin-right: 15px;
  }
`;

function ToolBar(props) {
  return <Wrap>{props.isOwner ? <OwnerToolBar {...props} /> : <NonOwnerToolBar {...props} />}</Wrap>;
}

ToolBar.propTypes = toolbarProptypes;

export default ToolBar;
