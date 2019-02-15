import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { Loader } from 'semantic-ui-react';

import ErrorHandler from 'shared_components/ErrorHandler';

const defaultLimit = 5;

export default class ListsHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: true,
      error: null,
      items: [],
      totalCount: 0,
    };
  }

  static propTypes = {
    apiFunction: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    itemKey: PropTypes.string.isRequired,
    limit: PropTypes.number,
    params: PropTypes.object,
    urlParams: PropTypes.object,
    replacePreviousItemsOnFetchMore: PropTypes.bool,
    showLoader: PropTypes.bool,
    haveIncludes: PropTypes.array,
  };

  static defaultProps = {
    limit: defaultLimit,
    params: {},
    urlParams: {},
    replacePreviousItemsOnFetchMore: false,
    showLoader: true,
    haveIncludes: null,
  };

  componentDidMount() {
    this.fetchMore();
  }

  makeRequest = async (page = 1, limit) => {
    const { haveIncludes } = this.props;
    const response = await this.props.apiFunction(
      {
        page,
        limit,
        ...this.props.params,
        ...(haveIncludes ? { include: haveIncludes } : {}),
      },
      this.props.urlParams,
    );

    return response.data;
  };

  retryRequest = () => {
    this.fetchMore(true);
  };

  fetchMore = (retry = false) => {
    if (typeof retry !== 'boolean') {
      console.warn('ListHandler component: retry should be boolean on fetchMore');
    }

    this.setState(
      prevState => ({
        page: retry ? prevState.page : prevState.page + 1,
        isLoading: true,
        error: null,
        items: this.props.replacePreviousItemsOnFetchMore ? [] : prevState.items,
      }),
      async () => {
        try {
          const data = await this.makeRequest(this.state.page, this.props.limit);
          let items = data[this.props.itemKey];
          if (!items) {
            throw new Error(`Could not find items with key '${this.props.itemKey}'`);
          }
          if (this.props.haveIncludes) {
            // We should map the includes into the items
            items = items.map(item => {
              const includes = this.props.haveIncludes.reduce((prev, includeKey) => {
                return {
                  ...prev,
                  [includeKey]: (data[includeKey] || data[pluralize(includeKey)]).find(
                    include => include._id === item[includeKey],
                  ),
                };
              }, {});
              return {
                ...item,
                ...includes,
              };
            });
          }

          this.setState(prevState => ({
            isLoading: false,
            items: [...prevState.items, ...items],
            totalCount: data.count,
          }));
        } catch (e) {
          this.setState({
            error: e.response ? e.response.data : e,
            isLoading: false,
          });
        }
      },
    );
  };

  render() {
    if (this.state.isLoading && this.state.items.length === 0 && this.props.showLoader) {
      return <Loader active inline="centered" />;
    }

    return (
      <ErrorHandler retryFunction={this.retryRequest}>
        {this.props.render({
          items: this.state.items,
          fetchMore: this.fetchMore,
          totalCount: this.state.totalCount,
          isLoading: this.state.isLoading,
        })}
      </ErrorHandler>
    );
  }
}
