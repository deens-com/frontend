import React, { Component } from 'react';
import Media from 'react-media';
import styled from 'styled-components';

import { sizes } from 'libs/styled';
import Button from 'shared_components/Button';
import { FilterIcon } from 'shared_components/icons';

const WrapTrigger = styled.div`
  button {
    padding: 12px 10px;
    & > span {
      display: flex;
      align-items: center;
    }
    svg {
      font-size: 20px;
    }
  }
  svg {
    display: inline-block !important;
    margin-right: 15px;
  }
`;

export default class ResponsiveToolBarWrap extends Component {
  state = {
    showFilters: false,
  };

  toggleFilters = () => {
    this.setState(({ showFilters }) => ({ showFilters: !showFilters }));
  };

  render() {
    const { showFilters } = this.state;
    return (
      <Media query={`(max-width: ${sizes.small})`}>
        {matches =>
          matches ? (
            <div>
              <WrapTrigger>
                <Button size="medium" type="button" onClick={this.toggleFilters} theme="textGreen">
                  <FilterIcon />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </WrapTrigger>
              {showFilters ? this.props.children({ isMobile: true }) : null}
            </div>
          ) : (
            this.props.children({ isMobile: false })
          )
        }
      </Media>
    );
  }
}
