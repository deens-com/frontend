import React, { Component } from 'react';

export default Wrapped =>
  class ExpandCardsHoc extends Component {
    state = {
      expandedResults: {},
    };

    toggleExpansionAll = () => {
      const { scheduledServices } = this.props;
      const shouldExpand = Object.keys(this.state.expandedResults).length === 0;

      this.setState(prevState => ({
        expandedResults: shouldExpand
          ? scheduledServices.reduce(
              (obj, day) => ({
                ...obj,
                ...day.services.reduce(
                  (serviceObj, service) => ({
                    ...serviceObj,
                    [service.tripOrganizationId]: true,
                  }),
                  {},
                ),
              }),
              {},
            )
          : {},
      }));
    };

    toggleExpansion = tripOrganizationId => {
      const expandedResults = {
        ...this.state.expandedResults,
        [tripOrganizationId]: !this.state.expandedResults[tripOrganizationId],
      };
      if (!expandedResults[tripOrganizationId]) {
        delete expandedResults[tripOrganizationId];
      }

      this.setState(prevState => ({
        expandedResults,
      }));
    };

    render() {
      return (
        <Wrapped
          {...this.props}
          expandedResults={this.state.expandedResults}
          toggleExpansionAll={this.toggleExpansionAll}
          toggleExpansion={this.toggleExpansion}
        />
      );
    }
  };
