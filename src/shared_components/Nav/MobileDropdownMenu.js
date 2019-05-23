// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import Media from 'react-media';
import { connect } from 'react-redux';

// COMPONENTS

// COMMENT: the homeSearch is just for the time being
import Image from 'shared_components/Image';

// ACTIONS/CONFIG
import { sizes } from '../../libs/styled';
import ImgurAvatar from './../../assets/no-avatar.png';
import Menu from 'shared_components/icons/Menu';
import CrossIcon from 'shared_components/icons/CrossIcon';

// STYLES
const AvatarWithUsername = styled.div`
  color: white;
  text-align: center;
  cursor: pointer;
  z-index: 23;
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin: auto;
  &.dark {
    color: #3c434b;
    svg {
      path {
        fill: #097da8;
      }
    }
  }
  &.avatar-only {
    right: 65px;
    top: 18px;
  }
  @media all and (min-width: ${sizes.medium}) {
    top: 30px;
  }
  img.image {
    display: inline-block;
    height: 30px;
    width: 30px;
    margin-left: 10px;
  }
  ${props =>
    props.isMenuOpen &&
    `svg {
      fill: #097DA8;
      margin-right: 25px;
    }`};
`;

// MODULE
class MobileDropDownMenu extends Component {
  render() {
    const dpUrl = this.props.session.profilePicture || ImgurAvatar;

    return (
      <Media query={`(max-width: ${sizes.large})`}>
        <AvatarWithUsername
          onTouchEnd={e => {
            e.preventDefault();
            this.props.toggleMenu();
          }}
          isMenuOpen={this.props.isMenuOpen}
          className={`${this.props.dark && 'dark'} ${this.props.avatarOnly && 'avatar-only'}`}
        >
          {this.props.isMenuOpen ? (
            <CrossIcon style={{ height: '20px', width: '20px', color: '097DA8' }} />
          ) : (
            <Menu style={{ color: '097DA8', height: '30px', width: '30px' }} />
          )}
          {this.props.session.username &&
            !this.props.isMenuOpen && <Image src={dpUrl} circular height={30} width={30} />}
        </AvatarWithUsername>
      </Media>
    );
  }
}

const mapStateToProps = state => ({
  session: state.session.session,
});

export default connect(
  mapStateToProps,
  null,
)(MobileDropDownMenu);
