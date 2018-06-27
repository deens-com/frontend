import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Media from 'react-media';

import { sizes } from 'libs/styled';

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
              <Button onClick={this.toggleFilters}>{showFilters ? 'Hide' : 'Show'} Filters</Button>
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
