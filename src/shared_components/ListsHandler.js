import React from 'react';
import PropTypes from 'prop-types';
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
    params: PropTypes.object,
    urlParams: PropTypes.object,
    replacePreviousItemsOnFetchMore: PropTypes.bool,
    showLoader: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    urlParams: {},
    replacePreviousItemsOnFetchMore: false,
    showLoader: true,
  };

  componentDidMount() {
    this.fetchMore();
  }

  makeRequest = async (page = 1, limit = defaultLimit) => {
    const response = await this.props.apiFunction(
      {
        page,
        limit,
        ...this.props.params,
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
          const data = await this.makeRequest(this.state.page);

          this.setState(prevState => ({
            isLoading: false,
            items: [...prevState.items, ...data[this.props.itemKey]],
            totalCount: data.count,
          }));
        } catch (e) {
          this.setState({
            error: e.response.data,
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
