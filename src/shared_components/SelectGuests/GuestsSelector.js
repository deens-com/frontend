import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import supportsPassive from 'libs/supportsPassive';
import PlusIcon from 'shared_components/icons/PlusIcon';
import MinusIcon from 'shared_components/icons/MinusIcon';
import { primary } from 'libs/colors';

const SelectorWrapper = styled.div`
  position: ${props => (props.relative ? 'relative' : 'absolute')};
  background-color: white;
  box-shadow: ${props => (props.relative ? 'none' : '0 0 5px rgba(0,0,0,0.3)')};
  width: 100%;
  max-width: 300px;
  min-width: 250px;
  margin: auto;
  left: 0;
  right: 0;
  padding: 15px;
  z-index: 5;
  color: #3c434b;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  height: 65px;
  align-items: center;
`;

const LeftColumn = styled.div`
  flex-shrink: 1;
  flex-wrap: wrap;
  margin-right: 20px;
`;
const RightColumn = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  line-height: 30px;
`;

const IconButton = styled.button`
  border: 1px solid ${primary};
  color: ${primary};
  border-radius: 5px 5px 5px 0;
  width: 32px;
  height: 32px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  :hover:enabled {
    background-color: ${primary};
    color: white;
    cursor: pointer;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const NumberOfPeople = styled.span`
  min-width: 25px;
  margin: 0 10px;
  text-align: center;
`;

const ApplyButton = styled.button`
  outline: 0;
  background: transparent;
  border: 0;
  color: #6fcf97;
  font-size: 18px;
  display: block;
  cursor: pointer;
  margin: 20px auto 10px;
  font-weight: bold;
  :hover {
    color: #097da8;
  }
`;

export default class GuestsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      adults: props.adults,
      infants: props.infants,
    };
    this.wrapperRef = React.createRef();
  }

  static propTypes = {
    adults: PropTypes.number,
    children: PropTypes.number,
    infants: PropTypes.number,
    close: PropTypes.func,
  };

  static defaultProps = {
    adults: 2,
    children: 0,
    infants: 0,
    close: () => {},
  };

  componentDidMount() {
    window.addEventListener(
      'touchstart',
      this.handleClickOutside,
      supportsPassive && { passive: false },
    );
    document.addEventListener('mousedown', this.handleClickOutside);
    const rect = this.wrapperRef.current.getBoundingClientRect();
    if (rect.y + rect.height > window.innerHeight) {
      this.wrapperRef.current.style.top = `${window.innerHeight - (rect.height + rect.y)}px`;
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'touchstart',
      this.handleClickOutside,
      supportsPassive && { passive: false },
    );
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    event.preventDefault();
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      if (
        this.props.children !== this.state.children ||
        this.props.adults !== this.state.adults ||
        this.props.infants !== this.state.infants
      ) {
        const { onApply } = this.props;
        onApply({
          ...this.state,
        });
      }
      this.props.close();
    }
  };

  addAdult = e => {
    e.preventDefault();
    this.setState(prevState => ({
      adults: prevState.adults + 1,
    }));
  };

  addChild = e => {
    e.preventDefault();
    this.setState(prevState => ({
      children: prevState.children + 1,
    }));
  };

  addInfant = e => {
    e.preventDefault();
    this.setState(prevState => ({
      infants: prevState.infants + 1,
    }));
  };

  removeAdult = e => {
    e.preventDefault();
    this.setState(prevState => ({
      adults: prevState.adults - 1,
    }));
  };

  removeChild = e => {
    e.preventDefault();
    this.setState(prevState => ({
      children: prevState.children - 1,
    }));
  };

  removeInfant = e => {
    e.preventDefault();
    this.setState(prevState => ({
      infants: prevState.infants - 1,
    }));
  };

  applyChanges = () => {
    const { onApply } = this.props;
    onApply({
      ...this.state,
    });
  };

  render() {
    const { relative, showApplyButton } = this.props;
    const { adults, infants, children } = this.state;

    return (
      <SelectorWrapper relative={relative} ref={this.wrapperRef}>
        <Row>
          <LeftColumn>
            Adults
            <br />
            (Ages > 13)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={adults <= 1} onClick={this.removeAdult}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{adults}</NumberOfPeople>
            <IconButton onClick={this.addAdult}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            Children
            <br />
            (Ages 2-12)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={children === 0} onClick={this.removeChild}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{children}</NumberOfPeople>
            <IconButton onClick={this.addChild}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            Infants
            <br />
            (Under 2)
          </LeftColumn>
          <RightColumn>
            <IconButton disabled={infants === 0} onClick={this.removeInfant}>
              <MinusIcon style={{ width: 24, height: 24 }} />
            </IconButton>
            <NumberOfPeople>{infants}</NumberOfPeople>
            <IconButton onClick={this.addInfant}>
              <PlusIcon />
            </IconButton>
          </RightColumn>
        </Row>
        {showApplyButton && <ApplyButton onClick={this.applyChanges}>Apply</ApplyButton>}
      </SelectorWrapper>
    );
  }
}
